import { DndContext, DragOverlay, type DragEndEvent, type DragOverEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { KanbanColumn } from "./components/KanbanColumn";
import { useKanbanStore } from "./store";

const App = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const updateBoardCompleted = useKanbanStore((state) => state.updateBoardCompleted)
  const kanbanArray = useKanbanStore((state) => state.kanbanArray)
  const reorderKanbanArray = useKanbanStore((state) => state.reorderKanbanArray)

  // 현재 드래그 중인 항목의 데이터를 찾습니다
  const activeItem = activeId ? kanbanArray.find((kanban) => kanban.id === activeId) : null;


  // 드래그 시작 시 호출
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(Number(active.id));
  }

  // 드래그 오버 핸들러
  // 항목이 드래그되면서 다른 항목이나 영역 위에 있을 때 지속적으로 호출됩니다
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!active || !over) return;
    if (active.id === over.id) return

    const overData = over.data?.current
    if (!overData) { return }

    const activeItem = kanbanArray.find((kanban) => kanban.id === Number(active.id));
    if (!activeItem) {
      debugger
      return
    }

    // 다른 보드 위로 드래그 중일 때
    // 시각적 피드백을 위해 임시로 타입 변경 (실제 데이터는 handleDragEnd에서 변경됨)
    switch (overData.type) {
      case "KANBAN":
        if (activeItem.completed === overData.completed) { break }
        updateBoardCompleted(Number(active.id), overData.completed);
        break
      case "COLUMN":
        if (activeItem.completed === overData.completed) { break }
        updateBoardCompleted(Number(active.id), overData.completed);
        break
      default:
        console.log("---- should not fall back here")
        debugger
    }
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
    if (over.data?.current?.completed && activeItem.completed !== over.data.current.completed) {
      // 항목의 타입을 변경하여 다른 보드로 이동
      updateBoardCompleted(Number(active.id), over.data.current.completed);
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
  }



  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="grid grid-cols-3 gap-3">
        <KanbanColumn completed="TODO" />
        <KanbanColumn completed="IN_PROGRESS" />
        <KanbanColumn completed="DONE" />
      </div>
      {/* DragOverlay: 드래그 중인 항목을 시각적으로 표시 */}
      <DragOverlay>
        {activeId && activeItem && (
          <div className="bg-white shadow-xl rounded-md p-4 w-full">

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{activeItem.title}</h3>
              {activeItem.completed === 'TODO'
                && <div className="animate-pulse w-2 h-2 rounded-full bg-green-500"></div>}
              {activeItem.completed === 'IN_PROGRESS'
                && <div className="animate-pulse w-2 h-2 rounded-full bg-amber-500"></div>
              }
              {activeItem.completed === 'DONE'
                && <div className="animate-pulse w-2 h-2 rounded-full bg-red-500"></div>}
            </div>

            {/* <p className="text-sm text-gray-500">{activeItem.created_at}</p> */}

          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default App