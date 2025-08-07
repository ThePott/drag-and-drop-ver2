import { useDroppable } from '@dnd-kit/core';
import { useKanbanStore, type Type } from '../store';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Knaban } from './Kanban';

export const KanbanColumn = ({ type }: { type: Type }) => {
    const kanbanArray = useKanbanStore((state) => state.kanbanArray)
    const filteredKanbanArray = kanbanArray.filter((kanban) => kanban.type === type)

    const { setNodeRef, isOver } = useDroppable({
        id: type,
        data: {
            type,
            // ---- 데이터 안의 "타입" 키에만 자동으로 반응하나? 모르겠다 -----
            accepts: ['TODO', 'IN_PROGRESS', 'DONE']
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
                    <Knaban key={kanban.id} id={kanban.id} kanban={kanban} />
                ))}
            </SortableContext>
            {/* 보드 내용 */}
        </div>
    );
}