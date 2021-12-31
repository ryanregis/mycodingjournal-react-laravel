import React from "react";
import {
    Typography,
    Box,
    IconButton,
    Modal
} from "@mui/material";

import axios from "axios";
import swal from "sweetalert";

import InputForms from "./InputForms";
import TableDisplay from "./TableDisplay";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    border: "2px solid #000",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
};

const showLoading = () => {
    swal("Loading", "Waiting for server response...", "info");
}

function Thoughts(props) {

    const [output, setOutput] = React.useState([]);
    const [retrieved, setRetrieved] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openEdit, setOpenEdit] = React.useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const [rowId, setRowId] = React.useState(0);
    const [rowContent, setRowContent] = React.useState([]);

    React.useEffect(() => {
        setTimeout(() => {
            retrieveThoughts();
        }, 0);
    }, [output]);


    async function retrieveThoughts() {
        await axios.get("api/retrievethoughts").then((response) => {
            if (response.data.status === 200) {
                console.log(response.data.thoughts);
                setRetrieved(response.data.thoughts);
                setLoading(false);
            } else {
                showLoading();
            }
        });
    }
    return (
        <Box sx={{ height: "80vh", p: 0, mb: 5 }}>
            {props.mobile ? (
                <IconButton
                    sx={{
                        position: "absolute",
                        top: "25px",
                        left: "25px",
                        fontSize: "clamp(2rem, 4.5vmax, 3rem)",
                    }}
                    variant="contained"
                    color="primary"
                    aria-label="Add Task"
                    onClick={handleOpen}>
                    <AddCircleIcon fontSize="inherit" />
                </IconButton>
            ) : (
                <IconButton
                    sx={{
                        position: "absolute",
                        top: "25px",
                        left: "25px",
                        fontSize: "clamp(2rem, 4.5vmax, 3rem)",
                    }}
                    variant="contained"
                    color="primary"
                    aria-label="Add Task"
                    onClick={handleOpen}>
                    <AddCircleIcon fontSize="inherit" />
                </IconButton>
            )}

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <IconButton
                        sx={{
                            alignSelf: "flex-end",
                            fontSize: "clamp(1.5rem, 2.5vmax, 100px)",
                        }}
                        variant="contained"
                        color="error"
                        aria-label="Add Task"
                        onClick={handleClose}>
                        <CancelIcon fontSize="inherit" />
                    </IconButton>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="text.primary"
                        align="center">
                        Add New Thought
                    </Typography>
                    <InputForms
                        isEdit={false}
                        type="Thought"
                        displayModal={setOpen}
                        changeOutput={setOutput}
                        outputData={output}
                        prevData={retrieved}
                    />
                </Box>
            </Modal>

            <Modal open={openEdit} onClose={handleCloseEdit}>
                <Box sx={modalStyle}>
                    <IconButton
                        sx={{
                            alignSelf: "flex-end",
                            fontSize: "clamp(1.5rem, 2.5vmax, 100px)",
                        }}
                        variant="contained"
                        color="error"
                        aria-label="Add Task"
                        onClick={handleCloseEdit}>
                        <CancelIcon fontSize="inherit" />
                    </IconButton>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="text.primary"
                        align="center">
                        Edit Thought
                    </Typography>
                    <InputForms
                        isEdit={true}
                        row_id={rowId}
                        rowData={rowContent}
                        type="Thought"
                        displayModal={setOpenEdit}
                        changeOutput={setOutput}
                        outputData={output}
                        prevData={retrieved}
                    />
                </Box>
            </Modal>

            <TableDisplay
                type="Thought"
                getRowId={setRowId}
                getRow={setRowContent}
                displayEditModal={setOpenEdit}
                outputContent={output}
                changeContent={setOutput}
                prevContent={retrieved}
            />
        </Box>
    );
}

export default Thoughts;
