import React, { useState, useEffect } from "react";
import { useTable, useSortBy, usePagination, useFilters } from "react-table";
import ERC20Token from "../contracts/ERC20Token";
import OfferContract from "../contracts/Offer";
import { Button, Table, Pagination } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import FillOfferModal from "./modal/FillOfferModal";
import {PAGE_SIZE} from "../helper/utils";

export default function ItemDataTable({
  columns,
  data,
  userContract,
  filterToken,
}) {

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

  const [btnText, setBtnText] = useState({ index: -1, text: "Buy" });
  const [loading, setLoading] = useState({});
  const { library } = useWeb3React();
  const [btnCancelText, setbtnCancelText] = useState("Cancel & withdraw");
  const [cancelLoading, setcancelLoading] = useState(false);
  const [pageList, setPageList] = useState([]);
  const [fillModalShow, setFillModalShow] = React.useState(-1);

  const onClick = async (i) => {
    console.log('onClick', i)
    if (userContract) {
      let prevText = btnText;
      try {
        setLoading(true);
        const offerContract = new OfferContract(
            data[i].offerAddresses,
            library.getSigner()
        );
        await offerContract.cancel();
        setBtnText("Canceled");
      } catch (err) {
        alert(JSON.stringify(err));
        console.log(err);
        setBtnText(prevText);
      }
    } else {
      setFillModalShow(i);
    }
  }

  useEffect(async () => {
    if (userContract) {
      setBtnText({text: "Cancel & withdraw"});
    }
    setPageSize(PAGE_SIZE);
  }, [userContract, setBtnText]);

  useEffect(async () => {
    let pageArray = [];
    let maxPage = pageCount;
    let minPage = pageIndex + 1;
    const pageRange = 2; // number of pages to show on each side
    if (pageIndex + pageRange < pageCount) {
      maxPage = pageIndex + pageRange + 1;
    }
    // figure out min page

    if (pageIndex <= pageRange) {
      minPage = 1;
    } else if (maxPage - minPage > pageRange) {
      minPage = maxPage - pageRange;
    } else {
      minPage = pageIndex - 1;
    }

    for (let number = minPage; number <= maxPage; number++) {
      pageArray.push(number);
    }
    setPageList(pageArray);
  }, [pageIndex, pageCount]);

  const onHide = () => {
    setFillModalShow(-1);
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
                          ? " ????"
                          : " ????"
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
                  <FillOfferModal
                      offer={data[i]}
                      show={fillModalShow === i}
                      onHide={onHide}
                  />
                  {row.cells.map((cell) => {
                    const { key, ...restCellProperties} = cell.getCellProps()
                    return (
                        <td {...restCellProperties} key={key}>{cell.render('Cell')}</td>
                    );
                  })}

                  <td className="w-28">
                    <Button
                      className="table-btn"
                      disable={loading.disabledButton === i}
                      onClick={() => onClick(i)}
                    >
                      {btnText.index === i && btnText.text != "Buy" ? (
                        btnText.text
                      ) : (
                        <>
                          {btnText.text}
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
          ><b>{1}</b></Pagination.First>
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
          ><b>{pageCount}</b></Pagination.Last>
        </Pagination>
      )}
    </>
  );
}
