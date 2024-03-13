import { prisma } from "../../data/postgres";
import { CreateTodoDto, TodoDatasource, TodoEntity, UpdateTodoDto } from "../../domain";

export class TodoDatasourceImpl implements TodoDatasource {

  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = await prisma.todo.create({
      data: createTodoDto! //signo de admiracion porque yo se que lo tengo, al haber pasado validacion del error
    });

    return TodoEntity.fromObject(todo);
  }

  // todo: paginacion
  async getAll(): Promise<TodoEntity[]> {
    const todos = await prisma.todo.findMany();
    return todos.map(TodoEntity.fromObject);
  }

  async findById(id: number): Promise<TodoEntity> {
    const todo = await prisma.todo.findFirst({
      where: { id }
    });

    if (!todo) throw `Todo with ${id} not found`;
    return TodoEntity.fromObject(todo);
  }

  async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.findById(updateTodoDto.id);

    const updatedTodo = await prisma.todo.update({
      where: { id: updateTodoDto.id },
      data: updateTodoDto!.values,
    });

    return TodoEntity.fromObject(updatedTodo);
  }

  async deleteById(id: number): Promise<TodoEntity> {
    const todo = await this.findById(id);

    const deleted = await prisma.todo.delete({
      where: { id }
    });

    return TodoEntity.fromObject(deleted);
  }

}
