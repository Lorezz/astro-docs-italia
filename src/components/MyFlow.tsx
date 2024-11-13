import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function MyFlow() {
  const nodes = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: { label: "Hello" },
      type: "input",
    },
    {
      id: "2",
      position: { x: 100, y: 100 },
      data: { label: "World" },
    },
  ];

  return (
    <ReactFlow nodes={nodes}>
      <Background />
      <Controls />
    </ReactFlow>
  );
}
