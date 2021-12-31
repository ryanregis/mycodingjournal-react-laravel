import React from "react";
import PropTypes from "prop-types";

import axios from "axios";

import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableFooter, TableRow, TablePagination,
    Paper, Box, Typography, Checkbox, useTheme, IconButton
} from "@mui/material";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import EditIcon from '@mui/icons-material/Edit';

import swal from "sweetalert";

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page">
                {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page">
                {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page">
                {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page">
                {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

function TableDisplay(props) {
    const [rows, setRows] = React.useState(props.outputContent);


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    async function handleAllCheckboxes(ev) {
        let newRows = [...rows];


        await axios.put(`api/checkall${props.type.toLowerCase()}s/${ev.target.checked ? 1 : 0}`).then(response => {
            if (response.data.status === 200) {
                newRows.forEach(
                    (_, index) => (newRows[index] = { ...newRows[index], is_checked: ev.target.checked })
                );
                console.log(response.data.message);
            } else {
                console.log("Unable to toggle checkbox");
            }
        });

        props.changeContent(newRows);
    }

    async function handleCheckbox(ev, id, index) {
        let newRows = [...rows];
        newRows[index] = { ...newRows[index], is_checked: ev.target.checked ? 1 : 0 };

        await axios.put(`api/check${props.type.toLowerCase()}/${id}`).then((response) => {
            if (response.data.status === 200) {
                console.log("Successfully toggled checkbox\n", response.data.message);
                props.changeContent(newRows);
            } else if (response.data.status === 404) {
                console.log("Error", response.data.message);
            }
        });
    }

    const handleIndeterminate = (ev) => {
        return ([...rows].filter((row) => row.is_checked).length > 0 && [...rows].filter((row) => row.is_checked).length < rows.length);
    }

    const handleDeleteAllItems = (ev) => {
        swal({
            title: "Are you sure?",
            text: "This action will permanently delete all items.",
            icon: "warning",
            buttons: [
                'No, cancel it!',
                'Yes, I am sure!'
            ],
            dangerMode: true,
        }).then(function (isConfirm) {
            if (isConfirm) {
                axios.delete(`api/truncate${props.type.toLowerCase()}`).then(response => {
                    swal("Successfully deleted all items.", response.data.message, "success");
                    props.changeContent([]);
                });
            }
        })
    };

    function handleDeleteSingleItem(ev, row_id) {

        swal({
            title: "Are you sure?",
            text: "This action will permanently delete this single item.",
            icon: "warning",
            buttons: [
                'No, cancel it!',
                'Yes, I am sure!'
            ],
            dangerMode: true,
        }).then(async function (isConfirm) {
            if (isConfirm) {
                await axios.delete(`api/delete${props.type.toLowerCase()}/${row_id}`).then(
                    response => {
                        if (response.data.status === 200) {
                            swal("Successfully Deleted!", response.data.message, "success");
                            props.changeContent([...rows].filter((obj) => obj.id !== row_id));
                        } else if (response.data.status === 404) {
                            swal("Error!", response.data.message, "error");
                        }
                    }
                );
            }
        })
    }

    function handleEdit(ev, id, row){
        props.getRowId(id);
        props.getRow(row);
        props.displayEditModal(true);
    }

    React.useEffect(() => {
        setRows(props.prevContent);
    }, [props.prevContent]);

    React.useEffect(() => {
        setRows(props.outputContent);
    }, [props.outputContent]);

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={rows.length > 0 ? handleIndeterminate() : false}
                                checked={rows.length > 0 ? [...rows].every((row) => row.is_checked === 1) : false}
                                onChange={handleAllCheckboxes}
                            />
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="h5">Date</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="h5">Title</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="h5">Description</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="h6">Edit</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <IconButton
                                variant="contained"
                                color="error"
                                onClick={handleDeleteAllItems}>
                                <DeleteForeverIcon fontSize="large" />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                    ).map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={row.is_checked === 1}
                                    onChange={(ev) => handleCheckbox(ev, row.id, index)}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Typography
                                    variant="body1"
                                    sx={
                                        row.is_checked === 1
                                            ? { textDecorationLine: "line-through", color: "text.disabled" }
                                            : { textDecorationLine: "none", color: "text.primary" }
                                    }>
                                    {row.date_content}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography
                                    variant="h6"
                                    sx={
                                        row.is_checked === 1
                                            ? { textDecorationLine: "line-through", color: "text.disabled" }
                                            : { textDecorationLine: "none", color: "text.primary" }
                                    }>
                                    {row.input_title}
                                </Typography>
                            </TableCell>
                            <TableCell align="justify">
                                <Typography
                                    variant="body2"
                                    sx={
                                        row.is_checked === 1
                                            ? { textDecorationLine: "line-through", color: "text.disabled" }
                                            : { textDecorationLine: "none", color: "text.primary" }
                                    }>
                                    {row.input_desc}
                                </Typography>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <IconButton
                                    variant="contained"
                                    color="info"
                                    onClick={(ev) => handleEdit(ev, row.id, row)}>
                                    <EditIcon fontSize="large" />
                                </IconButton>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <IconButton
                                    variant="contained"
                                    color="error"
                                    onClick={(ev) => handleDeleteSingleItem(ev, row.id)}>
                                    <HighlightOffIcon fontSize="large" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 43 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                            colSpan={6}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    "aria-label": "rows per page",
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

export default TableDisplay;
