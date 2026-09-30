import * as runtime from "@prisma/client/runtime/client";
export const PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export const PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export const PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export const PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export const PrismaClientValidationError = runtime.PrismaClientValidationError;
export const sql = runtime.sqltag;
export const empty = runtime.empty;
export const join = runtime.join;
export const raw = runtime.raw;
export const Sql = runtime.Sql;
export const Decimal = runtime.Decimal;
export const getExtensionContext = runtime.Extensions.getExtensionContext;
export const prismaVersion = {
    client: "7.10.0",
    engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    User: 'User',
    Product: 'Product',
    Category: 'Category',
    OrderItem: 'OrderItem',
    CartItem: 'CartItem',
    Order: 'Order',
    Cart: 'Cart',
    Payment: 'Payment'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastName',
    role: 'role',
    refreshToken: 'refreshToken',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ProductScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    price: 'price',
    stock: 'stock',
    sku: 'sku',
    imageUrl: 'imageUrl',
    isActive: 'isActive',
    categoryId: 'categoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const CategoryScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    slug: 'slug',
    imageUrl: 'imageUrl',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const OrderItemScalarFieldEnum = {
    id: 'id',
    quantity: 'quantity',
    price: 'price',
    productId: 'productId',
    orderId: 'orderId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const CartItemScalarFieldEnum = {
    id: 'id',
    quantity: 'quantity',
    productId: 'productId',
    cartId: 'cartId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const OrderScalarFieldEnum = {
    id: 'id',
    orderNumber: 'orderNumber',
    status: 'status',
    totalAmount: 'totalAmount',
    userId: 'userId',
    cartId: 'cartId',
    shippingAddress: 'shippingAddress',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const CartScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    checkOut: 'checkOut',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const PaymentScalarFieldEnum = {
    id: 'id',
    amount: 'amount',
    status: 'status',
    currency: 'currency',
    paymentMethod: 'paymentMethod',
    transactionId: 'transactionId',
    userId: 'userId',
    orderId: 'orderId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
export const defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map