import buildClient from "api/build-client";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";

const TicketDetails = ({ ticket }) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: order => router.push(`/orders/${order.id}`),
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
};

export const getServerSideProps = async ctx => {
  const { ticketId } = ctx.query; // or ctx.params
  const { data } = await buildClient(ctx).get(`/api/tickets/${ticketId}`);

  return { props: { ticket: data } };
};

export default TicketDetails;
