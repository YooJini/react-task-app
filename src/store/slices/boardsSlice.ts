import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBoard, IList, ITask } from "../../types";

type TBoardState = {
    modalActive: boolean;
    boardArray: IBoard[];
}

type TAddBoardAction = {
  board: IBoard;
}

type TDeleteBoardAction = {
  boardId: string;
}

type TAddListAction = {
  boardId: string;
  list: IList;
}

type TAddTaskAction = {
  boardId: string;
  listId: string;
  task: ITask;
}

type TDeleteTaskAction = {
  boardId: string;
  listId: string;
  taskId: string;
}

type TDeleteListAction = {
  boardId: string;
  listId: string;
}

type TSortAction = {
  boardIndex: number;
  droppableIdStart: string;
  droppableIdEnd: string;
  droppableIndexStart: number;
  droppableIndexEnd: number;
  draggableId: string;
}

const initialState : TBoardState = {
  modalActive: false,
  boardArray: [
    {
      boardId: "board-0",
      boardName: "첫 번째 게시물",
      lists: [
        {
          listId: "list-0",
          listName: "List 1",
          tasks: [
            {
              taskId: "task-0",
              taskName: "Task 1",
              taskDescription: 'Description',
              taskOwner: 'jini'
            },
            {
                taskId: "task-1",
                taskName: "Task 2",
                taskDescription: 'Description',
                taskOwner: 'jini'
              }
          ],
        },
        {
            listId: "list-1",
            listName: "List 2",
            tasks: [
              {
                taskId: "task-0",
                taskName: "Task 1",
                taskDescription: 'Description',
                taskOwner: 'jini'
              }
            ],
          }
      ],
    },
  ],
};

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard:(state, {payload}:PayloadAction<TAddBoardAction>) => {
      state.boardArray.push(payload.board);
    },
    deleteBoard: (state, {payload}:PayloadAction<TDeleteBoardAction>) => {
      state.boardArray = state.boardArray.filter(
        board => board.boardId !== payload.boardId
      )
    },
    addList: (state, {payload}:PayloadAction<TAddListAction>) => {
      state.boardArray = state.boardArray.map(
        board => board.boardId === payload.boardId
        ?
        {
          ...board,
          lists: [...board.lists, payload.list]
        }
        : board
      )
    },
    addTask: (state, {payload}:PayloadAction<TAddTaskAction>) => {
      state.boardArray = state.boardArray.map(board => board.boardId === payload.boardId
        ?
        {
          ...board,
          lists: board.lists.map(list => list.listId === payload.listId
            ?
            {
              ...list,
              tasks: [...list.tasks, payload.task]
            }
            : list
          )
        }
        : board
      )
    },
    updateTask: (state, {payload}:PayloadAction<TAddTaskAction>) => {
      state.boardArray = state.boardArray.map(board => board.boardId === payload.boardId
        ?
        {
          ...board,
          lists: board.lists.map(list => list.listId === payload.listId
            ?
            {
              ...list,
              tasks: list.tasks.map(task => task.taskId === payload.task.taskId
                ? payload.task
                : task
              )
            }
            : list
          )
        }
        : board
      )
    },
    deleteTask: (state, {payload}:PayloadAction<TDeleteTaskAction>) => {
      state.boardArray = state.boardArray.map(
        board => board.boardId === payload.boardId
        ?
        {
          ...board,
          lists: board.lists.map(list => list.listId === payload.listId
            ?
            {
              ...list,
              tasks: list.tasks.filter(
                task => task.taskId !== payload.taskId
              )
            }
            : list
          )
        }
        : board
      )
    },
    deleteList: (state, {payload}:PayloadAction<TDeleteListAction>) => {
      state.boardArray = state.boardArray.map(
        board => board.boardId === payload.boardId
        ?
        {
          ...board,
          lists: board.lists.filter(
            list => list.listId !== payload.listId
          )
        }
        :
        board
      )
    },
    setModalActive: (state, {payload}:PayloadAction<boolean>) => {
      state.modalActive = payload
    },

    sort: (state, {payload}:PayloadAction<TSortAction>) => {
      // 같은 리스트인 경우
      if(payload.droppableIdStart === payload.droppableIdEnd){
        // const board = state.boardArray[payload.boardIndex];
        const list = state.boardArray[payload.boardIndex].lists.find(
          list=> list.listId === payload.droppableIdStart
        )
        const card = list?.tasks.splice(payload.droppableIndexStart, 1);
        list?.tasks.splice(payload.droppableIndexEnd, 0, ...card!)
      }

      if(payload.droppableIdStart !== payload.droppableIdEnd){
        const listStart = state.boardArray[payload.boardIndex].lists.find(
          list=>list.listId === payload.droppableIdStart
        )

        const card = listStart?.tasks.splice(payload.droppableIndexStart, 1);
        const listEnd = state.boardArray[payload.boardIndex].lists.find(
          list => list.listId === payload.droppableIdEnd
        )

        if (card)
          listEnd?.tasks.splice(payload.droppableIndexEnd, 0, ...card);
      }
  }
}});

export const {addBoard, deleteBoard, addList, addTask, updateTask, deleteTask, deleteList, setModalActive, sort} = boardsSlice.actions;
export const boardsReducer = boardsSlice.reducer;
