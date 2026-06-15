import mongoose from "mongoose";
export declare const userModel: mongoose.Model<{
    username: string;
    email: string;
    password: string;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    username: string;
    email: string;
    password: string;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    username: string;
    email: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    username: string;
    email: string;
    password: string;
}, mongoose.Document<unknown, {}, {
    username: string;
    email: string;
    password: string;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    username: string;
    email: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    username: string;
    email: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    username: string;
    email: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const todoModel: mongoose.Model<{
    completion: boolean;
    userId: mongoose.Types.ObjectId;
    task?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    completion: boolean;
    userId: mongoose.Types.ObjectId;
    task?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    completion: boolean;
    userId: mongoose.Types.ObjectId;
    task?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    completion: boolean;
    userId: mongoose.Types.ObjectId;
    task?: string | null;
}, mongoose.Document<unknown, {}, {
    completion: boolean;
    userId: mongoose.Types.ObjectId;
    task?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    completion: boolean;
    userId: mongoose.Types.ObjectId;
    task?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    completion: boolean;
    userId: mongoose.Types.ObjectId;
    task?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    completion: boolean;
    userId: mongoose.Types.ObjectId;
    task?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=db.d.ts.map