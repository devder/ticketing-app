import buildClient from "api/build-client";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";

const OrderDetails = ({ order, currentUser }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => router.push("/orders"),
  });

  const handleToken = ({ id }) => {
    doRequest({ token: id });
  };

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <div>
        <StripeCheckout
          // token={({id}) => doRequest({token: id})}
          token={handleToken}
          stripeKey="pk_test_51IVXmiCzi2ofKHaHDC6cQ1rVgcqoSKN92SlGQTM2t6G8FJcK6W8B1iVr062rSiZAcYwDbZbwqmh4dvbpU7hC1Iko00XLUBqGNF"
          amount={order.ticket.price * 100}
          email={currentUser.email}
        />
        {errors}
      </div>
    </div>
  );
};

export const getServerSideProps = async ctx => {
  const { orderId } = ctx.query; // ctx.params
  const { data } = await buildClient(ctx).get(`api/orders/${orderId}`);
  return { props: { order: data } };
};
export default OrderDetails;
