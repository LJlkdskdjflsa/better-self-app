import { useRef } from 'react';
import type { XYCoord } from 'react-dnd';
import { useDrag, useDrop } from 'react-dnd';

import { ItemType } from '../utils/enums';
import type { ApplicantModel, DragItem } from '../utils/models';

/**
 * Custom React Hook for handling drag and drop of tasks.
 *
 * @template T - The type of HTML element to which this hook will be attached.
 *
 * @param {Object} params - The parameters for the hook.
 * @param {ApplicantModel} params.task - The task that can be dragged and dropped.
 * @param {number} params.index - The index of the task in its current column.
 * @param {(i: number, j: number) => void} handleDropHover - The function to be called when a dragged task is hovering over a droppable area.
 *
 * @returns {Array} An array containing:
 * - `isDragging`: A boolean indicating whether the task is currently being dragged.
 * - `drag`: A connector function to be used with the `drag` source.
 * - `drop`: A connector function to be used with the `drop` target.
 */
export function useTaskDragAndDrop<T extends HTMLElement>(
  { task, index }: { task: ApplicantModel; index: number },
  handleDropHover: (i: number, j: number) => void
) {
  const ref = useRef<T>(null);

  const [{ isDragging }, drag] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    item: { from: task.column, id: task.id, index },
    type: ItemType.APPLICANT,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem, void, unknown>({
    accept: ItemType.APPLICANT,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      // the tasks are not on the same column
      if (item.from !== task.column) {
        return;
      }

      const draggedItemIndex = item.index;
      const hoveredItemIndex = index;

      // we are swapping the task with itself
      if (draggedItemIndex === hoveredItemIndex) {
        return;
      }

      const isDraggedItemAboveHovered = draggedItemIndex < hoveredItemIndex;
      const isDraggedItemBelowHovered = !isDraggedItemAboveHovered;

      // get mouse coordinatees
      const {
        // x: mouseX,
        y: mouseY,
      } = monitor.getClientOffset() as XYCoord;

      // get hover item rectangle
      const hoveredBoundingRect = ref.current.getBoundingClientRect();

      // Get hover item middle height position
      const hoveredMiddleHeight =
        (hoveredBoundingRect.bottom - hoveredBoundingRect.top) / 2;

      const mouseYRelativeToHovered = mouseY - hoveredBoundingRect.top;
      const isMouseYAboveHoveredMiddleHeight =
        mouseYRelativeToHovered < hoveredMiddleHeight;
      const isMouseYBelowHoveredMiddleHeight =
        mouseYRelativeToHovered > hoveredMiddleHeight;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      if (isDraggedItemAboveHovered && isMouseYAboveHoveredMiddleHeight) {
        return;
      }

      if (isDraggedItemBelowHovered && isMouseYBelowHoveredMiddleHeight) {
        return;
      }

      // Time to actually perform the action
      handleDropHover(draggedItemIndex, hoveredItemIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // item.index = hoveredItemIndex;
    },
  });

  drag(drop(ref));

  return {
    ref,
    isDragging,
  };
}
