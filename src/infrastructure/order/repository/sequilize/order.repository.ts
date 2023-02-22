import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository  implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          // Para obter o preço unitário foi necessário dividir pela quantidade
          // Lembrando que o get price do orderItem retorna o preço * quantidade
          price: item.price / item.quantity,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

   async update(entity: Order): Promise<void> {

    const filter = { where: { id: entity.id }, rejectOnEmpty: true, include: [{ model: OrderItemModel }] };
    let order;

    try{
      order = await OrderModel.findOne(filter).then((model) => {
        // Atualiza e salva os dados da ordem
        model.customer_id = entity.customerId;
        model.total = entity.total();
        model.save();

        // Apaga os itens existentes
        model.items.map((item) => { item.destroy() });
        
        // Cria os novos itens baseados nos itens da entidade
        entity.items.map((item) => {
          OrderItemModel.create({
            order_id: model.id,
            id: item.id,
            name: item.name,
            price: item.price / item.quantity,
            product_id: item.productId,
            quantity: item.quantity,
          })
        })
      })
    } catch(error){
      throw new Error("Order not found");
    }
  }
  
  async find(id: string): Promise<Order> {
    const filter = { where: { id: id }, rejectOnEmpty: true, include: ['items']};
    let orderModel;
    
    try {
      orderModel = await OrderModel.findOne(filter);
    } catch (error) {
      throw new Error("Order not found");
    }

    const result = new Order(
      id, 
      orderModel.customer_id,
      orderModel.items.map((item) => new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      ))
    );

    return result;
  }

  async findAll(): Promise<Order[]> {
    let orderModelList;
    
    try {
      orderModelList = await OrderModel.findAll({ include: [{ model: OrderItemModel }] });
    } catch (error) {
      throw new Error("Order not found");
    }

    return orderModelList.map((orderModel) => 
      new Order(
        orderModel.id, 
        orderModel.customer_id,
        orderModel.items.map((item) => new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        ))
      )
    )
  }
}
