import { useDrop } from 'react-dnd';

import type { ColumnType } from '../utils/enums';
import { ItemType } from '../utils/enums';
import type { ApplicantModel, DragItem } from '../utils/models';

function useColumnDrop(
  column: ColumnType,
  handleDrop: (fromColumn: ColumnType, taskId: ApplicantModel['id']) => void
) {
  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ItemType.APPLICANT,
    drop: (dragItem) => {
      if (!dragItem || dragItem.from === column) {
        return;
      }

      handleDrop(dragItem.from, dragItem.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return {
    isOver,
    dropRef,
  };
}

export default useColumnDrop;
