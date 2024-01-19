import { useEffect, useRef, useState } from 'react';
import { DFA } from '../../Automata/DFA';
import Svg from '../Svg/Svg';
import { observer } from 'mobx-react-lite';
import { createDFAGraph } from '../../Automata/DFAGraph';
import Node from '../Graph/Node';
import Edge from '../Graph/Edge';
import { Transform2D } from '../Graph/Transform2D';
import { useDrag } from '../../hooks/useDrag';

export interface DFAVisualizerProps {
  dfa: DFA;
}

const DFAVisualizer = observer(({ dfa }: DFAVisualizerProps) => {
  const [graph, setGraph] = useState<any>({});

  const transformRef = useRef(new Transform2D());
  const transform = transformRef.current;

  useEffect(() => {
    const graph = createDFAGraph(dfa);
    setGraph(graph);
  }, [dfa]);

  const ref = useRef<HTMLDivElement>(null);
  const elementRef = useRef({ x: 0, y: 0 });
  useDrag(ref, {
    onStartDrag: (e) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const clickAreaX = e.pageX - rect.x;
        const clickAreaY = e.pageY - rect.y;
        const [x, y] = transform.transformInverse([clickAreaX, clickAreaY]);
        elementRef.current = { x, y };
      }
    },
    onDrag: (e) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const clickAreaX = e.pageX - rect.x;
        const clickAreaY = e.pageY - rect.y;
        const [x, y] = transform.transformInverse([clickAreaX, clickAreaY]);
        transform.move(x - elementRef.current.x, y - elementRef.current.y);
        elementRef.current = { x, y };
      }
    },
    onDrop: (e) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const clickAreaX = e.pageX - rect.x;
        const clickAreaY = e.pageY - rect.y;
        const [x, y] = transform.transformInverse([clickAreaX, clickAreaY]);
      }
    },
  });

  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '100%' }}
      onWheel={(e) => {
        const clickArea = ref.current;
        if (clickArea) {
          // Screen space to canvas space
          const rect = clickArea.getBoundingClientRect();
          const clickAreaX = e.pageX - rect.x;
          const clickAreaY = e.pageY - rect.y;
          const [x, y] = transform.transformInverse([clickAreaX, clickAreaY]);

          const zoom = e.deltaY > 0 ? 0.9 : 1.1;
          if (transform.scaling[0] * zoom < 250) {
            transform.zoomTo([x, y], zoom);
          }
        }
      }}
    >
      <Svg transform={transform}>
        <circle cx={0} cy={0} r={50} fill="red"></circle>
        {graph?.edges &&
          Object.keys(graph.edges).map((key) => <Edge key={key} graph={graph} edge={graph.edges[key]}></Edge>)}

        {graph?.nodes && Object.keys(graph.nodes).map((state) => <Node key={state} node={graph.nodes[state]}></Node>)}
      </Svg>
    </div>
  );
});

export default DFAVisualizer;
