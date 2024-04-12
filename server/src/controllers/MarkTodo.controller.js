import { validationResult } from "express-validator";
import Todo from "../models/Todo.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";

export const MarkTodo = async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.json(
            jsonGenerate(
                StatusCode.VALIDATION_ERROR,
                "Todo id is requied!",
                error.mapped()
            )
        );
    }

    try {
        const todo = await Todo.findOneAndUpdate(
            {
                _id: req.body.todo_id,
                userId: req.userId,
            },
            [
                {
                    $set: {
                        isCompleted: {
                            $eq: [false, "$isCompleted"],
                        },
                    },
                },
            ]
        );

        if (todo) {
            return res.json(jsonGenerate(StatusCode.SUCCESS, "Task Status Successfully Updated! Continue Your Progress!", todo));
        }
    } catch (error) {
        return res.json(
            jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Updation of the Todo Task failed!", null)
        );
    }
};