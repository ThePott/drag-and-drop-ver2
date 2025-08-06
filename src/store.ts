import { create } from "zustand";

type Type = "TODO" | "IN_PROGRESS" | "DONE"

interface Kanban {
    id: number
    type: Type
}

interface KanbanState {
    kanbanArray: Kanban[]
    updateBoardType: (id: number, type: Type) => void
    reorderKanbanArray: (kanbanArray: Kanban[]) => void
}

const useKanbanStore = create<KanbanState>()((set) => ({
    // 기본 상태
    kanbanArray: [], // 모든 보드 항목을 저장하는 배열

    // 항목의 보드 타입 변경 액션 (드래그 앤 드롭으로 다른 보드로 이동할 때 사용)
    // id: 변경할 항목의 고유 ID
    // newType: 새 보드 타입 ('todo', 'inprogress', 'done' 중 하나)
    updateBoardType(id, type) {
        set(
            (state) => {
                return { kanbanArray: state.kanbanArray.map((item) => (item.id === id ? { ...item, type: type } : item)), }
            }
        )
    },,

    // 항목들의 순서 재정렬 액션 (동일 보드 내에서 항목 순서 변경 시 사용)
    // newData: 재정렬된 전체 항목 배열
    reorderKanbanArray: (kanbanArray) => set({ kanbanArray }),
}))