import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import MaterialReactTable from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  Typography,
  useTheme,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import VibrationDataService from "../services/vibration.service.js";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { connect } from "react-redux";
import { setMessage } from "../actions/message";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useMediaQuery from '@mui/material/useMediaQuery';

const Client = (props) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rerender, setReRendering] = useState(false);
  const tableInstanceRef = useRef(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!tableData.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const response = await VibrationDataService.getclients();
        const json = response.data;
        setTableData(json);
      } catch (error) {
        setIsError(true);
        console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          props.dispatch(setMessage(error.response.data.message));
        }
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
  }, [rerender]);

  const handleCreateNewRow = (values) => {
    //tableData.push(values);
    //setTableData([...tableData]);
    setReRendering((value) => !value);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const data = {
        name: values["name"],
        status: values["status"] === "true" ? "A" : "D",
      };
      if (row.original.status === "A" && values["status"] === "false") {
        //Going to delete
        window.alert("Please use the delete button to delete");
        return;
      }
      VibrationDataService.updateclient(values.id, data)
        .then((response) => {
          setReRendering((value) => !value);
          exitEditingMode();
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            //dispatch error message to show the message in message/alert area
            console.log(error.response.data.message);
            props.dispatch(setMessage(error.response.data.message));
          }
        });
      //tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      //setTableData([...tableData]);
      //exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !window.confirm(
          `Are you sure you want to delete ${row.getValue(
            "name"
          )} and all its locations if any? Locations if any would be unlinked from sensor.`
        )
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      //tableData.splice(row.index, 1);
      //setTableData([...tableData]);
      VibrationDataService.deleteclient(row.getValue("id"))
        .then((response) => {
          props.dispatch(setMessage(response.data.message));
          setReRendering((value) => !value);
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            props.dispatch(setMessage(error.response.data.message));
          }
        });
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid = validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "name",
        header: "Client Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "status",
        header: "Client Status",
        /*enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,*/ //User can edit a deleted customer back to active
        accessorFn: (row) => (row.status === "A" ? "true" : "false"), //must be strings
        filterVariant: "checkbox",
        Cell: ({ cell }) => (
          <>
            {cell.getValue() === "true" ? (
              <VerifiedUserIcon color="primary" />
            ) : (
              <DangerousIcon color="error" />
            )}
          </>
        ),
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          select: true,
          children: [
            <MenuItem key={"A"} value={"true"}>
              {"Active"}
            </MenuItem>,
            <MenuItem key={"D"} value={"false"}>
              {"Deleted"}
            </MenuItem>,
          ],
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportRows = (rows) => {
    csvExporter._options.filename = "Clients";
    csvExporter._options.title = "Clients";
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter._options.filename = "Clients";
    csvExporter._options.title = "Clients";
    csvExporter.generateCsv(tableData);
  };

  return (
    <>
      {tableInstanceRef.current && (
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            gap: "0.5rem",
            py: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Button
            fullWidth
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Create New Client
          </Button>
          <Button
            fullWidth
            disabled={
              tableInstanceRef.current.getPrePaginationRowModel().rows
                .length === 0
            }
            onClick={() =>
              handleExportRows(
                tableInstanceRef.current.getPrePaginationRowModel().rows
              )
            }
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Rows
          </Button>
          <Button
            fullWidth
            disabled={tableInstanceRef.current.getRowModel().rows.length === 0}
            onClick={() =>
              handleExportRows(tableInstanceRef.current.getRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Page Rows
          </Button>
          <Button
            fullWidth
            disabled={
              !tableInstanceRef.current.getIsSomeRowsSelected() &&
              !tableInstanceRef.current.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() =>
              handleExportRows(
                tableInstanceRef.current.getSelectedRowModel().rows
              )
            }
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Selected Rows
          </Button>
        </Box>
      )}
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        initialState={{ showColumnFilters: true, density: "compact" }}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
        }}
        columns={columns}
        data={tableData}
        editingMode="modal"
        enableRowSelection
        enableColumnOrdering
        enableEditing
        //enableDensityToggle={false}
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        tableInstanceRef={tableInstanceRef}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: "1rem",
              p: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <Button
              color="secondary"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
            >
              Create New Client
            </Button>
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              onClick={() =>
                handleExportRows(table.getPrePaginationRowModel().rows)
              }
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export All Rows
            </Button>
            <Button
              disabled={table.getRowModel().rows.length === 0}
              onClick={() => handleExportRows(table.getRowModel().rows)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export Page Rows
            </Button>
            <Button
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              //only export selected rows
              onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export Selected Rows
            </Button>
          </Box>
        )}
      />
      <CreateNewModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        dispatch={props.dispatch}
      />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  dispatch,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const setInitialValues = () =>
    columns.reduce((acc, column) => {
      switch (column.accessorKey) {
        case "status":
          acc[column.accessorKey] = "A";
          break;
        default:
          acc[column.accessorKey ?? ""] = "";
      }
      return acc;
    }, {});

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Client name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [values, setValues] = useState(setInitialValues);

  const modalSubmit = () => {
    //put your validation logic here
    const data = { name: values["name"], status: values["status"] };
    VibrationDataService.createclient(data)
      .then((response) => {
        setValues(setInitialValues);
        onSubmit();
        onClose();
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          dispatch(setMessage(error.response.data.message));
        }
      });
    //onSubmit(values);
    //onClose();
  };

  return (
    <Dialog open={open} fullScreen={fullScreen}>
      <DialogTitle textAlign="center">Create New Client</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === "status") {
                return (
                  <FormControl fullWidth>
                    <InputLabel id="role-select-label">
                      {column.header}
                    </InputLabel>
                    <Select
                      key={column.accessorKey}
                      labelId="role-select-label"
                      label={column.header}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      disabled="true"
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <MenuItem key="A" value="A">
                        {"Active"}
                      </MenuItem>
                      <MenuItem key="D" value="D">
                        {"Deleted"}
                      </MenuItem>
                    </Select>
                  </FormControl>
                );
              } else {
                return (
                  <>
                    <TextField
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      {...register(column.accessorKey)}
                      error={errors[column.accessorKey] ? true : false}
                      disabled={column.accessorKey === "id" ? true : false}
                      value={values[column.accessorKey]}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <Typography variant="inherit" color="error">
                      {errors[column.accessorKey]?.message}
                    </Typography>
                  </>
                );
              }
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="secondary"
          onClick={handleSubmit(modalSubmit)}
          variant="contained"
        >
          Create New Client
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Client);
