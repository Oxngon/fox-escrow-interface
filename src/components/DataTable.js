import React, { useState, useEffect } from "react";
import { useTable, useSortBy, usePagination, useFilters } from "react-table";
import ERC20Token from "../contracts/ERC20Token";
import OfferContract from "../contracts/Offer";
import { Button, Table, Pagination } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";

export default function DataTable({
  columns,
  data,
  userContract,
  filterToken,
}) {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  // const defaultColumn = React.useMemo(
  //   () => ({
  //     // Let's set up our default Filter UI
  //     Filter: DefaultColumnFilter,
  //   }),
  //   []
  // );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      // filterTypes,
      // defaultColumn,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const [btnText, setBtnText] = useState({ index: -1, text: "Approve" });
  const [loading, setLoading] = useState({});
  const { library } = useWeb3React();
  const [btnCancelText, setbtnCancelText] = useState("Cancel");
  const [cancelLoading, setcancelLoading] = useState(false);
  const [pageList, setPageList] = useState([]);

  useEffect(async () => {
    console.log(btnText);
    if (userContract) {
      setBtnText("cancel & withdraw");
    }
    setPageSize(10);
  }, []);

  useEffect(async () => {
    console.log(filterToken);
  }, [filterToken]);

  useEffect(async () => {
    let pageArray = [];
    let maxPage = pageCount;
    let minPage = pageIndex + 1;
    const pageRange = 5;
    if (pageIndex + pageRange < pageCount) {
      maxPage = pageIndex + pageRange;
    }
    if (maxPage - minPage >= pageRange - 1) {
      minPage = pageIndex + 1;
    } else {
      if (maxPage == 1) {
        minPage = 1;
      } else {
        if (pageCount % 2 == 0) {
          minPage = pageRange - 1;
        } else {
          minPage = pageRange - 2;
        }
      }
    }

    for (let number = minPage; number <= maxPage; number++) {
      pageArray.push(number);
    }
    setPageList(pageArray);
  }, [pageIndex, pageCount]);

  const btnClick = async (index) => {
    if (userContract) {
      let prevText = btnText;
      try {
        if (btnText.text === "cancel & withdraw") {
          setLoading({ disabledButton: index, status: true });
          setBtnText({ index, text: "please wait...." });
          const offerContract = new OfferContract(
            data[index].offerAddresses,
            library.getSigner()
          );
          await offerContract.cancel();
          setBtnText({ index, text: "Cannceled" });
        }
      } catch (err) {
        alert(JSON.stringify(err));
        console.log(err);
        setBtnText({ index, text: prevText });
      }

      setLoading({ disabledButton: index, status: false });
    } else {
      setLoading({ disabledButton: index, status: true });
      console.log(loading);
      let prevText = btnText.text;
      setBtnText({ index, text: "please wait...." });
      try {
        if (btnText.text === "Fill") {
          console.log("Fill");
          const offerContract = new OfferContract(
            data[index].offerAddresses,
            library.getSigner()
          );
          await offerContract.fill();
          setBtnText({ index, text: "Complete" });
        } else if (btnText.text === "Approve") {
          console.log(data[index].stableCoin, data[index].amountWantedInWei);
          const erc20 = new ERC20Token(
            data[index].stableCoin,
            library.getSigner()
          );
          await erc20.approve(
            data[index].offerAddresses,
            data[index].amountWantedInWei
          );
          setBtnText({ index, text: "Fill" });
        }
      } catch (err) {
        alert(JSON.stringify(err));
        console.log(err);
        setBtnText({ index, text: prevText });
      }

      setLoading({ disabledButton: index, status: false });
    }
  };

  return (
    <>
      <div className="market-body-content">
        <Table className="market-table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}

                  <td className="w-28">
                    <Button
                      className="table-btn"
                      disable={loading.disabledButton === i}
                      onClick={() => {
                        btnClick(i);
                      }}
                    >
                      {btnText.index === i && btnText.text != "Approve" ? (
                        btnText.text
                      ) : (
                        <>
                          Approve
                          <br /> {data[i].tokenWantedSymbol}{" "}
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {!userContract && (
        <Pagination className="pt-3">
          <Pagination.First
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          />
          <Pagination.Prev
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          />
          {pageList.map((pageNumber) => (
            <Pagination.Item
              active={pageNumber == pageIndex + 1}
              onClick={() => gotoPage(pageNumber - 1)}
            >
              {pageNumber}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
          <Pagination.Last
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          />
        </Pagination>
      )}
    </>
  );
}
