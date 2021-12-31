import React from 'react'
import { Box, Typography, FormControl, FilledInput, InputLabel, Button, TextField } from '@mui/material';

import moment from 'moment';
import axios from "axios";
import swal from "sweetalert";

import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

const styles = {
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    container: {
        m: 2,
        display: 'flex',
        width: '80%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
    },
    inputs: {
        width: '100%',
        display: 'flex',
    },
    inputTitle: {
        width: '100%',
    }

}

function InputForms(props) {


    const [input_title, setInputTitle] = props.isEdit ? React.useState(props.rowData.input_title) : React.useState('');
    const [input_desc, setInputDesc] = props.isEdit ? React.useState(props.rowData.input_desc) : React.useState('');

    const [dateValue, setDateValue] = props.isEdit ? React.useState(moment(props.rowData.date_content)) : React.useState(new moment());

    const handleTitle = (ev) => {
        setInputTitle(ev.target.value);
    };

    const handleDesc = (ev) => {
        setInputDesc(ev.target.value);
    };

    const handleOutputData = (inputContent) => {
        props.changeOutput([...props.prevData, inputContent]);
        props.displayModal(false);
    };

    async function handleSubmit(ev) {
        ev.preventDefault();

        if (input_title.trim() !== '' && input_desc.trim() !== '') {
            let date_content = `${dateValue.month() + 1}/${dateValue.date()}/${dateValue.year()}`;
            let is_checked = false;
            let content = { input_title, input_desc, is_checked, date_content};
            console.log(content);
            handleReset();
            
            if(props.isEdit){
                await axios.put(`api/update${props.type.toLowerCase()}/${props.row_id}`, content)
                .then(response => {
                    if (response.data.status === 200) {
                        swal(`Successfully updated ${props.type}!`, response.data.message, "success");
                        handleOutputData(content);
                    } else if (response.data.status === 422) {
                        swal("Error updating data to server!", response.data.message, "error");
                    }
                    else {
                        swal("Something's wrong", "Please refresh or debug the error.", "error");
                    }
                });
            }
            else {
                await axios.post(`api/add${props.type.toLowerCase()}`, content)
                .then(response => {
                    if (response.data.status === 200) {
                        swal(`Successfully added ${props.type}!`, response.data.message, "success");
                        handleOutputData(content);
                    } else if (response.data.status === 422) {
                        swal("Error adding data to server!", response.data.message, "error");
                    }
                    else {
                        swal("Something's wrong", "Please refresh or debug the error.", "error");
                    }
                });
            }
        }
        else {
            swal("Please input data.", "All input fields are required.", "error");
        }
    }

    const handleReset = () => {
        setInputTitle('');
        setInputDesc('');
    }

    // React.useEffect(() => {
    //     // if (props.type === "Task") localStorage.setItem(`taskData`, JSON.stringify(props.outputData));
    //     // if (props.type === "Thought") localStorage.setItem(`thoughtData`, JSON.stringify(props.outputData));
    //     // if (props.type === "Task") {

    //     // }
    //     // if (props.type === "Thought") {

    //     // }
    // }, [props.outputData]);

    return (
        <form name={props.type} action="/" style={styles.root} onSubmit={handleSubmit} onReset={handleReset}>
            <Box sx={styles.container}>
                <LocalizationProvider dateAdapter={DateAdapter}>
                    <Box sx={{ width: '100%', gap: 2, flexWrap: 'wrap' }} display="flex" alignItems="center" justifyContent="center">
                        <DatePicker
                            label="Choose Date"
                            value={dateValue}
                            onChange={(newDateValue) => {
                                setDateValue(newDateValue);
                            }}
                            renderInput={(params) => <TextField {...params} helperText={params?.inputProps?.placeholder} />}
                        />
                        <FormControl variant="filled" sx={styles.inputTitle}>
                            <InputLabel htmlFor="component-title">{props.type} Title</InputLabel>
                            <FilledInput id="component-title" value={input_title} onChange={handleTitle} sx={{ pt: 0.5, fontSize: '1.75rem', width: '100%', }} />
                        </FormControl>

                    </Box>
                </LocalizationProvider>

                <FormControl variant="filled" sx={styles.inputs}>
                    <InputLabel htmlFor="component-desc">{props.type} Description</InputLabel>
                    <FilledInput id="component-desc" value={input_desc} onChange={handleDesc} multiline minRows={5} maxRows={8} sx={{ pt: 3.5, fontSize: '1.15rem' }} />
                </FormControl>

                <Box sx={{ width: '100%', gap: 5 }} display="flex" justifyContent="center" alignItems="center">
                    <Button type="submit" variant="contained" color="success">
                        <Typography variant="button" fontWeight="bold">Submit</Typography>
                    </Button>
                    <Button type="reset" variant="contained" color="error">
                        <Typography variant="button" fontWeight="bold">Reset</Typography>
                    </Button>
                </Box>

            </Box>
        </form>
    )
}

export default InputForms
