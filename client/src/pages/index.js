import buildClient from "api/build-client";
import Link from "next/link";

const Home = ({ tickets }) => {
  const ticketList = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link
          href={{
            pathname: "/tickets/[ticketId]",
            query: { ticketId: ticket.id },
          }}
          // href={`/tickets/${ticket.id}`}
          // as="ticket-route"
        >
          <a>View</a>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

export const getServerSideProps = async ctx => {
  const { data } = await buildClient(ctx).get("/api/tickets");
  return { props: { tickets: data } };
};

// Home.getInitialProps = async (appContext, client, currentUser) => {
//   const { data } = await client.get("/api/tickets");
//   return { tickets: data };
// };
export default Home;
