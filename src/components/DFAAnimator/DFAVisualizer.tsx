import { useEffect, useState } from 'react';
import { DFA } from '../../Automata/DFA';
import { observer } from 'mobx-react-lite';
import { createDFAGraph } from '../../Automata/DFAGraph';
import Node from '../Graph/Node';
import Edge from '../Graph/Edge';
import Canvas from '../Canvas/Canvas';

export interface DFAVisualizerProps {
  dfa: DFA;
}

const DFAVisualizer = observer(({ dfa }: DFAVisualizerProps) => {
  const [graph, setGraph] = useState<any>({});

  useEffect(() => {
    const graph = createDFAGraph(dfa);
    setGraph(graph);
  }, [dfa]);

  const focusRectangle = document.getElementById('visible-graph-area')?.getBoundingClientRect();

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas focusRectangle={focusRectangle}>
        {graph?.edges &&
          Object.keys(graph.edges).map((key) => (
            <Edge
              key={key}
              graph={graph}
              edge={graph.edges[key]}
              isActive={
                dfa.inTransition &&
                graph.edges[key].conditions.includes(dfa.input[dfa.currentIndex]) &&
                graph.edges[key].from == dfa.currentState
                  ? true
                  : false
              }
            ></Edge>
          ))}

        {graph?.nodes &&
          Object.keys(graph.nodes).map((state) => (
            <Node
              key={state}
              node={graph.nodes[state]}
              isActive={!dfa.inTransition && dfa.currentState == state ? true : false}
            ></Node>
          ))}
      </Canvas>
    </div>
  );
});

export default DFAVisualizer;
