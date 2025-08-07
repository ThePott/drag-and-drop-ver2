import { DndContext, type DragEndEvent, type DragStartEvent, type UniqueIdentifier } from "@dnd-kit/core";
import { useState } from "react";
import { useKanbanStore } from "./store";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./components/KanbanColumn";

const App = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const updateBoardType = useKanbanStore((state) => state.updateBoardType)
  const kanbanArray = useKanbanStore((state) => state.kanbanArray)
  const reorderKanbanArray = useKanbanStore((state) => state.reorderKanbanArray)

  // 현재 드래그 중인 항목의 데이터를 찾습니다
  const activeItem = activeId ? kanbanArray.find((kanban) => kanban.id === activeId) : null;


  // 드래그 시작 시 호출
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(Number(active.id));
  };

  // 드래그 종료 시 호출
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return
    };

    // 드래그 중인 항목 찾기
    const activeItem = kanbanArray.find((kanban) => kanban.id === active.id);
    if (!activeItem) {
      setActiveId(null);
      return;
    }

    // 다른 보드로 항목 이동 (예: todo -> inprogress)
    // over.data?.current?.type은 드롭된 보드의 타입을 나타냄 (useDroppable에서 data로 설정한 값)
    if (over.data?.current?.type && activeItem.type !== over.data.current.type) {
      // 항목의 타입을 변경하여 다른 보드로 이동
      updateBoardType(Number(active.id), over.data.current.type);
    } else if (over.id !== active.id) {
      // 동일 보드 내에서 항목 순서 변경
      // 드래그한 항목과 드롭 위치 항목의 인덱스 찾기
      const activeIndex = kanbanArray.findIndex((kanban) => kanban.id === active.id);
      const overIndex = kanbanArray.findIndex((kanban) => kanban.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        // arrayMove: dnd-kit이 제공하는 배열 재정렬 유틸리티 함수
        // 배열 내에서 항목의 위치를 변경합니다
        const newKanbanArray = arrayMove(kanbanArray, activeIndex, overIndex);
        // 재정렬된 항목들로 상태 업데이트
        reorderKanbanArray(newKanbanArray);
      }
    }

    setActiveId(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-3 gap-3">
        <KanbanColumn type="TODO"/>
        <KanbanColumn type="IN_PROGRESS"/>
        <KanbanColumn type="DONE"/>
      </div>
    </DndContext>
  );
}

export default App