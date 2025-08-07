import { useSortable } from '@dnd-kit/sortable';
import type { Kanban } from '../store';

export const Knaban = ({ id, kanban }: { id: number, kanban: Kanban }) => {
  // useSortable 훅으로 드래그 가능한 항목 설정
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id,
    data: {
      type: "KANBAN"
    }
  });

  // 드래그 중일 때의 스타일
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-[200px] h-[200px] bg-amber-300 justify-self-center"
    >
      {/* 항목 내용 */}
      <p>{kanban.title}</p>
    </div>
  );
}