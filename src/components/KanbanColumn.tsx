import { useDroppable } from '@dnd-kit/core';
import { useKanbanStore, type Completed } from '../store';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Knaban } from './Kanban';

export const KanbanColumn = ({ completed }: { completed: Completed }) => {
    const kanbanArray = useKanbanStore((state) => state.kanbanArray)
    const filteredKanbanArray = kanbanArray.filter((kanban) => kanban.completed === completed)
    // debugger
    const { setNodeRef, isOver } = useDroppable({
        id: completed,
        data: {
            type: "COLUMN",
            completed
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={isOver ? 'bg-slate-200' : ''}
        >
            {/* id array로 넘기지 않고 그냥 통으로 넘긴다? 그럼 참조 주소 배열로 여기나? */}
            <SortableContext items={filteredKanbanArray} strategy={verticalListSortingStrategy}>
                {filteredKanbanArray.map((kanban) => (
                    <Knaban key={kanban.id} kanban={kanban} />
                ))}
            </SortableContext>
            {/* 보드 내용 */}
        </div>
    );
}