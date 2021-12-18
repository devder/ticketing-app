import buildClient from "api/build-client";

const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map(order => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      ))}
    </ul>
  );
};

export default OrderIndex;

export const getServerSideProps = async ctx => {
  const { data } = await buildClient(ctx).get("/api/orders");
  return { props: { orders: data } };
};
