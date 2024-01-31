import { useDrop } from 'react-dnd';

import type { ApplicantModelNew } from '../model';
import { ItemType } from '../utils/enums';
import type { DragItem } from '../utils/models';

function useColumnDrop(
  column: string,
  handleDrop: (fromColumn: string, taskId: ApplicantModelNew['id']) => void
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
