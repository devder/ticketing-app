import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

const NewTicket = () => {
  const router = useRouter();
  const [data, setData] = useState({ title: "", price: "" });
  const { title, price } = data;

  const { doRequest, errors } = useRequest({
    method: "post",
    url: "/api/tickets",
    body: { title, price },
    // onSuccess: ticket => console.log(ticket),
    onSuccess: () => router.push("/"),
  });

  const handleInputChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleInputBlur = e => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setData({ ...data, price: value.toFixed(2) });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Create a Ticket</h1>
        <div className="form-group">
          <label>Title</label>
          <input value={title} className="form-control" name="title" type="text" onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            value={price}
            name="price"
            type="number"
            onChange={handleInputChange}
            //  onBlur event is triggered whenever a user clicks out of the input
            onBlur={handleInputBlur}
          />
        </div>
        {errors}
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewTicket;
