import React, { useState } from "react";
import cns from "classnames";
import "./App.css";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const App = () => {
    const [paginationPageSize, setPaginationPageSize] = useState(500);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setRowData] = useState(null);
    const [currentPageRowCount, setCurrentPageRowCount] = useState(0);
    const [rowCount, setRowCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const updateGrid = () => {
        setCurrentPageRowCount(
            gridApi.paginationGetCurrentPage() + 1 ===
                gridApi.paginationGetTotalPages()
                ? rowCount % paginationPageSize
                : paginationPageSize
        );
        setRowCount(gridApi.paginationGetRowCount());
        setCurrentPage(gridApi.paginationGetCurrentPage() + 1);
        setTotalPages(gridApi.paginationGetTotalPages());
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => {
            setRowData(data);
            if (data.length) {
                setCurrentPageRowCount(
                    data.length > paginationPageSize
                        ? paginationPageSize
                        : data.length
                );
                setRowCount(data.length);
                setCurrentPage(1);
                setTotalPages(Math.ceil(data.length / 500));
            }
        };

        fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
            .then((resp) => resp.json())
            .then((data) => updateData(data));
    };

    const onBtFirst = () => {
        gridApi.paginationGoToFirstPage();
        updateGrid();
    };

    const onBtLast = () => {
        gridApi.paginationGoToLastPage();
        updateGrid();
    };

    const onBtNext = () => {
        gridApi.paginationGoToNextPage();
        updateGrid();
    };

    const onBtPrevious = () => {
        gridApi.paginationGoToPreviousPage();
        updateGrid();
    };

    return (
        <div className="table-container">
            <div className="table-wrapper">
                <div
                    id="myGrid"
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                    className="ag-theme-alpine"
                >
                    <AgGridReact
                        defaultColDef={{
                            resizable: true,
                            filter: true,
                        }}
                        debug={true}
                        rowSelection={"multiple"}
                        paginationPageSize={paginationPageSize}
                        pagination={true}
                        suppressPaginationPanel={true}
                        suppressScrollOnNewData={true}
                        onGridReady={onGridReady}
                        rowData={rowData}
                    >
                        <AgGridColumn
                            headerName="#"
                            width={50}
                            cellRenderer={cellRenderer}
                        />
                        <AgGridColumn
                            headerName="Athlete"
                            field="athlete"
                            width={150}
                        />
                        <AgGridColumn headerName="Age" field="age" width={90} />
                        <AgGridColumn
                            headerName="Country"
                            field="country"
                            width={120}
                        />
                        <AgGridColumn
                            headerName="Year"
                            field="year"
                            width={90}
                        />
                        <AgGridColumn
                            headerName="Date"
                            field="date"
                            width={110}
                        />
                        <AgGridColumn
                            headerName="Sport"
                            field="sport"
                            width={110}
                        />
                        <AgGridColumn
                            headerName="Gold"
                            field="gold"
                            width={100}
                        />
                        <AgGridColumn
                            headerName="Silver"
                            field="silver"
                            width={100}
                        />
                        <AgGridColumn
                            headerName="Bronze"
                            field="bronze"
                            width={100}
                        />
                        <AgGridColumn
                            headerName="Total"
                            field="total"
                            width={100}
                        />
                    </AgGridReact>
                </div>
            </div>
            <div className="pagination-wrapper">
                <input
                    type="text"
                    className="pagination-input"
                    placeholder="Type here..."
                />
                <span className="pagination-info mr-3">
                    <b>{gridApi ? (currentPageRowCount ? `1` : `0`) : ""}</b> to{" "}
                    <b>{gridApi ? currentPageRowCount : ""}</b> of{" "}
                    <b>{gridApi ? rowCount : ""}</b>
                </span>
                <span
                    className={cns(
                        "pagination-utils",
                        currentPage === 1 ? "disabled" : ""
                    )}
                    onClick={() => onBtFirst()}
                >{`<<`}</span>

                <span
                    className={cns(
                        "pagination-utils",
                        currentPage === 1 ? "disabled" : ""
                    )}
                    onClick={() => onBtPrevious()}
                >{`<`}</span>
                <span className="pagination-info">
                    Page <b>{gridApi ? currentPage : ""}</b> of{" "}
                    <b>{gridApi ? totalPages : ""}</b>
                </span>
                <span
                    className={cns(
                        "pagination-utils",
                        currentPage === totalPages ? "disabled" : ""
                    )}
                    onClick={() => onBtNext()}
                >{`>`}</span>
                <span
                    className={cns(
                        "pagination-utils",
                        currentPage === totalPages ? "disabled" : ""
                    )}
                    onClick={() => onBtLast()}
                    id="btLast"
                >
                    {`>>`}
                </span>
            </div>
        </div>
    );
};

var cellRenderer = function (params) {
    return parseInt(params.node.id) + 1;
};

export default App;
