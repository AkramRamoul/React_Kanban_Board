export type Id = string | number;

export type column = {
  id: Id;
  title: string;
};

export type task = {
  id: Id;
  columnId: Id;
  content: string;
};
