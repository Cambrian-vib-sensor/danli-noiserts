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
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DangerousIcon from "@mui/icons-material/Dangerous";
import VibrationDataService from "../services/vibration.service.js";
import { connect } from "react-redux";
import { setMessage } from "../actions/message";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useMediaQuery from '@mui/material/useMediaQuery';

const LOCATION_TYPE = ['A', 'B', 'C']

const Location = (props) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rerender, setReRendering] = useState(false);
  const [clients, setClients] = useState([]);
  const txtClientStatus = useRef();
  const tableInstanceRef = useRef(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await VibrationDataService.getactiveclients();
        const json = response.data;
        setClients(json);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          props.dispatch(setMessage(error.response.data.message));
        }
        return;
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!tableData.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const response = await VibrationDataService.getlocations();
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
        location_type: values["location_type"],
        name: values["name"],
        email: values["email"],
        client_id: values["client.id"],
        status: values["status"] == "true" ? "A" : "D",
      };
      if (row.original.status === "A" && values["status"] === "false") {
        //Going to delete
        window.alert("Please use the delete button to delete");
        return;
      }
      if (
        row.original.client.id !== values["client.id"] &&
        values["status"] === "false"
      ) {
        window.alert("Location should be active to link to a new client");
        return;
      }
      if (values["client.status"] === "D" && values["status"] === "true") {
        window.alert(
          "Location cannot be made Active when the client's status is Deleted"
        );
        return;
      }
      VibrationDataService.updatelocation(values.id, data)
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
            if (error.response.data.message === "Location linked to sensor") {
              window.alert(
                "Cannot delete location. Please unlink location from sensor " +
                error.response.data.sensor +
                " before deleting."
              );
            }
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
    //Delete and unlink from sensor
    (row) => {
      if (
        !window.confirm(
          `Are you sure you want to delete ${row.getValue("name")}`
        )
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      //tableData.splice(row.index, 1);
      //setTableData([...tableData]);
      VibrationDataService.deletelocation(row.getValue("id"))
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
            if (error.response.data.message === "Location linked to sensor") {
              window.alert(
                "Cannot delete location. Please unlink location from sensor " +
                error.response.data.sensor +
                " before deleting."
              );
            }
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
          const isValid =
            cell.column.id === "email"
              ? validateEmails(event.target.value) //if value.length > 0, then split emails by ; and check each entity for valid email
              : validateRequired(event.target.value);
          if (!isValid) {
            const errorMsg =
              cell.column.id === "email"
                ? `${cell.column.columnDef.header} should be valid email ids separated by ;`
                : `${cell.column.columnDef.header} is required`;
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: errorMsg,
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
        header: "Location Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "location_type",
        header: "Location Type",
        size: 140,
        muiTableBodyCellEditTextFieldProps: (cell) => {
          const children = LOCATION_TYPE.map((l) => (
            <MenuItem key={l} value={l}>
              {l}
            </MenuItem>
          ))

          return {
            select: true,
            children: children,
          };
        },
      },
      {
        accessorKey: "status",
        header: "Location Status",
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
      {
        accessorKey: "client.id",
        Cell: ({ cell }) => <>{cell.row.original.client.name}</>,
        header: "Client",
        size: 140,
        muiTableBodyCellEditTextFieldProps: (cell, row) => {
          return {
            select: true,
            children: clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name}
              </MenuItem>
            )),
            onChange: (e) => {
              let selectedClient = clients.find(
                (client) => client.id === e.target.value
              );
              txtClientStatus.current = selectedClient.status;
            },
          };
        },
      },
      {
        accessorKey: "client.status",
        header: "Client Status",
        size: 140,
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        accessorFn: (row) => {
          return row.client.status === "A" ? "true" : "false";
        }, //must be strings
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
          value: txtClientStatus.current,
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "email",
        header: "Email",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps, clients]
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
    csvExporter._options.filename = "Locations";
    csvExporter._options.title = "Locations";
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter._options.filename = "Locations";
    csvExporter._options.title = "Locations";
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
            Create New Location
          </Button>
          <Button
            fullWidth
            disabled={
              tableInstanceRef.current.getPrePaginationRowModel().rows
                .length === 0
            }
            //export all rows, including from the next page, (still respects filtering and sorting)
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
              <IconButton
                onClick={() => {
                  txtClientStatus.current = row.original.client.status;
                  table.setEditingRow(row);
                }}
              >
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
              Create New Location
            </Button>
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              //export all rows, including from the next page, (still respects filtering and sorting)
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
        clients={clients}
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
  clients,
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
    name: Yup.string().required("Location name is required"),
    location_type: Yup.string().required("Location type is required"),
    client_id: Yup.number()
      .required("Client name is required")
      .typeError("Client name is required"),
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
    const data = {
      name: values["name"],
      client_id: values["client_id"],
      status: values["status"],
      email: values["email"],
      location_type: values["location_type"],
    };
    VibrationDataService.createlocation(data)
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
      <DialogTitle textAlign="center">Create New Location</DialogTitle>
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
              if (column.accessorKey === "client.id") {
                return (
                  <FormControl fullWidth>
                    <InputLabel id="allClients">{column.header}</InputLabel>
                    <Select
                      key={"client_id"}
                      {...register("client_id")}
                      error={errors["client_id"] ? true : false}
                      labelId="allClients"
                      label={column.header}
                      name={"client_id"}
                      onChange={(e) => {
                        let selectedClient = clients.find(
                          (client) => client.id === e.target.value
                        );
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                          ["client.status"]: selectedClient.status,
                        });
                      }}
                    >
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography variant="inherit" color="error">
                      {errors["client_id"]?.message}
                    </Typography>
                  </FormControl>
                );
              } else if (column.accessorKey === "status") {
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
                if (column.accessorKey === "location_type") {
                  return (
                    <FormControl fullWidth>
                      <InputLabel id="role-select-label">
                        {column.header}
                      </InputLabel>
                      <Select
                        {...register(column.accessorKey)}
                        key={column.accessorKey}
                        labelId="role-select-label"
                        label={column.header}
                        name={column.accessorKey}
                        value={values[column.accessorKey]}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        {
                          LOCATION_TYPE.map((l) => <MenuItem key={l} value={l}>
                            {l}
                          </MenuItem>)
                        }

                      </Select>
                    </FormControl>
                  );
                } else {
                  return (
                    <>
                      <TextField
                        key={column.accessorKey}
                        label={column.header}
                        {...register(column.accessorKey)}
                        name={column.accessorKey}
                        error={errors[column.accessorKey] ? true : false}
                        disabled={
                          column.accessorKey === "id" ||
                            column.accessorKey === "client.status"
                            ? true
                            : false
                        }
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
              }
            }
            )}
          </Stack>
      </form>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit(modalSubmit)}
            color="secondary"
            variant="contained"
          >
            Create New Location
          </Button>
        </DialogActions>

    </Dialog>
  );
};

const validateEmails = (email) => {
  if (!email.length) return true;
  return !email.split(";").find((item) => !validateEmail(item));
};

const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

const validateRequired = (value) => !!value.length;

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Location);
