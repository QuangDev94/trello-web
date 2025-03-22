/* eslint-disable react/prop-types */
import Box from "@mui/material/Box"
import ListColumns from "./ListColumns/ListColumns"
import { mapOrder } from "~/utils/sorts"
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useCallback, useEffect, useRef, useState } from "react"
import Column from "./ListColumns/Column/Column"
import Card from "./ListColumns/Column/ListCards/Card/Card"
import { cloneDeep, isEmpty } from "lodash"
import { generatePlaceHolderCard } from "~/utils/formatters"
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
}

// eslint-disable-next-line react/prop-types
function BoardContent({ board }) {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  })
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 100 },
  })
  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng 1 thời điểm chỉ có 1 phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null)

  // Điểm va chạm cuối cùng (fix bug collision)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"))
  }, [board])

  const findColumnByCardId = (cardId) => {
    const column = orderedColumns?.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId),
    )
    return column
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeCardId,
    activeCardData,
  ) => {
    setOrderedColumns((prevColumns) => {
      const overCardIndex = overColumn?.cards?.findIndex(
        (c) => c._id === overCardId,
      )
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1
      // thay đổi dữ liệu trong các column
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(
        (c) => c._id === activeColumn._id,
      )
      const nextOverColumn = nextColumns.find((c) => c._id === overColumn._id)
      if (nextActiveColumn) {
        // xóa card ở column active
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (c) => c._id !== activeCardId,
        )
        // Thêm placeholder Card nếu column rỗng
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceHolderCard(nextActiveColumn)]
        }
        // cập nhật thứ tự
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((c) => c._id)
      }
      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (c) => c._id !== activeCardId,
        )
        // Cập nhật lại columnId cho cardId
        const rebuild_activeCardData = {
          ...activeCardData,
          columnId: nextOverColumn._id,
        }
        // thêm card mới vào column over vào đúng vị trí đã chọn trong column
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeCardData,
        )

        // Xóa placeholder Card nếu nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (c) => !c.FE_PlaceholderCard,
        )
        // cập nhật thứ tự
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((c) => c._id)
      }
      console.log("nextColumns: ", nextColumns)
      return nextColumns
    })
  }
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN,
    )
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu bắt đầu kéo card thì mới thực hiện hành động set old column
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  const handleDragOver = (event) => {
    // ko xử lý nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event

    if (!active || !over) return

    const {
      id: activeCardId,
      data: { current: activeCardData },
    } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeCardId)
    const overColumn = findColumnByCardId(overCardId)
    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeCardId,
        activeCardData,
      )
    }
  }
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return
    // Xử lý kéo thả card trong board content
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeCardId,
        data: { current: activeCardData },
      } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // Kéo thả card khi khác column
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeCardId,
          activeCardData,
        )
      } else {
        // Kéo thả card trong 1 column
        // Lấy vị trí cũ của card trong column
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId,
        )
        // Lấy vị trí mới của card trong column
        const newCardIndex = overColumn?.cards.findIndex(
          (c) => c._id === overCardId,
        )
        // Cập nhật mảng mới của cards
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex,
        )
        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id,
          )
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id)
          return nextColumns
        })
      }
    }
    // Xử lý kéo thả column trong board content
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldIndex = orderedColumns.findIndex((c) => c._id === active.id)
        const newIndex = orderedColumns.findIndex((c) => c._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
        // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
        setOrderedColumns(dndOrderedColumns)
      }
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  }

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }
      // Tìm các điểm giao nhau, va chạm -- intersections với con trỏ
      const pointerIntersections = pointerWithin(args)
      if (!pointerIntersections?.length) return
      // Thuật toán phát hiện va chạm sẽ trả về 1 mảng các va chạm ở đây
      // const intersections =
      //   pointerIntersections?.length > 0
      //     ? pointerIntersections
      //     : rectIntersection(args)

      // tìm overId đầu tiên trong mảng intersections ở trên
      let overId = getFirstCollision(pointerIntersections, "id")

      if (overId) {
        // nếu overId là của column thì sẽ tìm tới cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCenter hoặc closestCorners
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId,
        )
        if (checkColumn) {
          // console.log("overId before: ", overId)
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                )
              },
            ),
          })[0]?.id
          // console.log("overId after: ", overId)
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }
      //  nếu overId null thì trả về mảng rỗng - tránh cash page
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns],
  )
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
