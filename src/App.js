import React from "react";
import "./styles.css";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Database from "./Database/Database.json";
const style = {
  table: {
    minWidth: 650
  }
};
class abc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: [],
      search: "",
      to: 0,
      from: 1000000,
      dateTo: "",
      dateFrom: "",
      currentPage: 1,
      recordPerPage: 50
    };
  }
  componentDidMount() {
    if (localStorage.getItem("localstorage")) {
      const DataArr = JSON.parse(localStorage.getItem("localstorage"));
      this.setState({
        Data: DataArr
      });
    } else {
      const json = JSON.stringify(Database);
      localStorage.setItem("localstorage", json);

      this.setState({
        Data: JSON.parse(json)
      });
    }
  }

  HandlerSearching = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  handleClick = (event) => {
    this.setState({
      currentPage: Number(event.target.id)
    });
  };
  render() {
    const { classes } = this.props;
    const {
      Data,
      search,
      to,
      from,
      dateTo,
      dateFrom,
      currentPage,
      recordPerPage
    } = this.state;

    // Logic for displaying current todos
    const indexOfLastTodo = currentPage * recordPerPage;
    const indexOfFirstTodo = indexOfLastTodo - recordPerPage;
    const currentRecord = Data.slice(indexOfFirstTodo, indexOfLastTodo);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(Data.length / recordPerPage); i++) {
      pageNumbers.push(i);
    }
    const filterData = currentRecord.filter((item) => {
      const searchString = `${item.text} ${item.amount}`;
      return searchString.toLowerCase().includes(search.toLowerCase());
    });

    const filterDataAmount = filterData.filter((item) => {
      return item.amount >= to && item.amount < from;
    });

    const filterDate = filterDataAmount.filter((item) => {
      if (dateTo !== "" && dateFrom !== "") {
        console.log(
          new Date(item.date).getTime() / 1000 >=
            new Date(dateTo).getTime() / 1000 &&
            new Date(item.date).getTime() / 1000 <
              new Date(dateFrom).getTime() / 1000
        );
        return (
          new Date(item.date).getTime() / 1000 >=
            new Date(dateTo).getTime() / 1000 &&
          new Date(item.date).getTime() / 1000 <
            new Date(dateFrom).getTime() / 1000
        );
      } else {
        return true;
      }
    });
    console.log(dateTo);

    return (
      <div>
        <TextField
          id="standard-basic"
          value={search}
          name="search"
          label="Text Search"
          onChange={this.HandlerSearching}
        />
        <TextField
          id="standard-basic"
          value={to}
          name="to"
          label="Amount To"
          onChange={this.HandlerSearching}
        />
        <TextField
          id="standard-basic"
          value={from}
          name="from"
          label="Amount From"
          onChange={this.HandlerSearching}
        />
        <TextField
          id="date"
          label="To Date"
          type="date"
          name="dateTo"
          defaultValue={dateTo}
          onChange={this.HandlerSearching}
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="date"
          label="From Date"
          type="date"
          name="dateFrom"
          defaultValue={dateFrom}
          onChange={this.HandlerSearching}
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
        />
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>

              <TableCell align="right">Text</TableCell>

              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterDate.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="right">{item.id}</TableCell>
                <TableCell align="right">{item.text}</TableCell>
                <TableCell align="right">{item.amount}</TableCell>
                <TableCell align="right">{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ul id="page-numbers">
          {pageNumbers.map((number) => {
            return (
              <u>
                <b>
                  <li key={number} id={number} onClick={this.handleClick}>
                    {number}
                  </li>
                </b>
              </u>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default withStyles(style)(abc);
