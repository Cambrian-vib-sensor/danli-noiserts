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
  Snackbar,
  Alert
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DangerousIcon from "@mui/icons-material/Dangerous";
import VibrationDataService from "../services/vibration.service.js";
import { setMessage } from "../actions/message";
import { connect } from "react-redux";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useMediaQuery from '@mui/material/useMediaQuery';

//const roles = [{'C': 'Client'}, {'A': 'Admin'}, {'U': 'Cambrian User'}];
const roles = [
  { type: "C", role: "Client" },
  { type: "A", role: "Admin" },
  { type: "U", role: "Cambrian User" },
];
const passwordHide = "****************";

const User = (props) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rerender, setReRendering] = useState(false);
  const [clients, setClients] = useState([]);
  const [sensors, setSensors] = useState([]);
  const txtClientStatus = useRef();
  const tableInstanceRef = useRef(null);

  const fetchSensorWithoutUser = async () => {
    try {
      const response = await VibrationDataService.getSensorWithoutUser();
      const json = response.data;
      setSensors(json)
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
  }

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
  useEffect(() => {
    fetchSensorWithoutUser()
    fetchClients();
  }, [rerender]);

  useEffect(() => {
    const fetchData = async () => {
      if (!tableData.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const response = await VibrationDataService.getusers();
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

  const handleCreateNewRow = () => {
    //tableData.push(values);
    //setTableData([...tableData]);
    //Re-render the page.
    setReRendering((value) => !value);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const data = {
        username: values["username"],
        password:
          values["password"] === passwordHide
            ? row.original.password
            : values["password"],
        role: values["role"],
        client_id: values["client.id"],
        email: values["email"],
        phone_number: values["phone_number"],
        status: values["status"] === "true" ? "A" : "D",
      };
      if (
        row.original.client.id !== values["client.id"] &&
        values["status"] === "false"
      ) {
        window.alert("User should be active to link to a new client");
        return;
      }
      if (values["client.status"] === "D" && values["status"] === "true") {
        window.alert(
          "User cannot be made Active when the client's status is Deleted"
        );
        return;
      }
      VibrationDataService.updateuser(values.id, data)
        .then((response) => {
          if (values['sensor.name'] === "NONE") {
            VibrationDataService.assignSensorToUser(null, row.original.sensor.id)
          } else {
            VibrationDataService.assignSensorToUser(values.id, values['sensor.name'])
          }

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
          `Are you sure you want to delete ${row.getValue("username")}`
        )
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      //tableData.splice(row.index, 1);
      //setTableData([...tableData]);
      VibrationDataService.deleteuser(row.getValue("id"))
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
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "password"
                ? validatePassword(event.target.value)
                : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            const errorMsg =
              cell.column.id === "username"
                ? `${cell.column.columnDef.header} is required and should be a valid email id`
                : cell.column.id === "password"
                  ? `${cell.column.columnDef.header} is required and should be 8 characters long`
                  : `${cell.column.columnDef.header} is required`;
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
        accessorKey: "username",
        header: "User Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "password",
        header: "Password",
        accessorFn: (row) => passwordHide,
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "phone_number",
        header: "Phone",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "sensor.name",
        accessorFn: (row) => row.sensor?.id, //must be strings
        header: "Sensor",
        Cell: ({ cell }) => <>{cell.row.original.sensor?.name}</>,
        size: 140,
        muiTableBodyCellEditTextFieldProps: (cell) => {
          const children = [<MenuItem key={"none"} value="NONE">
            NONE
          </MenuItem>].concat((sensors).map((sensor) => (
            <MenuItem key={sensor.id} value={sensor.id}>
              {sensor.name}
            </MenuItem>
          )))
          if (cell.row.original.sensor?.id) {
            children.push(<MenuItem disabled key={cell.row.original.sensor.id} value={cell.row.original.sensor.id}>
              {cell.row.original.sensor.name}
            </MenuItem>)
          }
          return {
            select: true,
            children: children,
          };
        },
      },
      {
        accessorKey: "status",
        header: "User Status",
        enableColumnOrdering: false,
        //enableEditing: false, //disable editing on this column
        enableSorting: false,
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
        //Edit: ({ cell, column, row, table }) => <ClientsList column={column} row={row}/>,
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
        accessorKey: "role",
        header: "Role",
        /*muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),*/
        Cell: ({ cell }) => (
          <>
            {cell.getValue() === "A"
              ? "Admin"
              : cell.getValue() === "U"
                ? "Cambrian"
                : "Client"}
          </>
        ),
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: roles.map((role) => (
            <MenuItem key={role.type} value={role.type}>
              {role.role}
            </MenuItem>
          )),
        },
      },
    ],
    [getCommonEditTextFieldProps, clients, sensors]
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
    csvExporter._options.filename = "Users";
    csvExporter._options.title = "Users";
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter._options.filename = "Users";
    csvExporter._options.title = "Users";
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
            Create New User
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
              Create New User
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
        sensors={sensors}
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        clients={clients}
        dispatch={props.dispatch}
        notificationMsg={props.notificationMsg}
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
  sensors,
  notificationMsg,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [openErrorAlert, setOpenErrorAlert] = useState(false)
  const handleClose = () => {
    setOpenErrorAlert(false)
  }

  const setInitialValues = () =>
    columns.reduce((acc, column) => {
      switch (column.accessorKey) {
        case "status":
          acc[column.accessorKey] = "A";
          break;
        case "role":
          acc[column.accessorKey] = "C";
          break;
        default:
          acc[column.accessorKey ?? ""] = "";
      }
      return acc;
    }, {});

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required "),
    email: Yup.string()
      .required("Username is required and must be a valid email id")
      .email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
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
      username: values["username"],
      email: values["email"],
      password: values["password"],
      role: values["role"],
      client_id: values["client_id"],
      status: values["status"],
      phone_number: values["phone_number"],
      phone_number_no_reading: values["phone_number"],
    };
    VibrationDataService.createuser(data)
      .then((response) => {
        const userId = response.data.id
        if (values.sensor_id) {
          VibrationDataService.assignSensorToUser(userId, values.sensor_id)
        }
        setValues(setInitialValues);
        onSubmit(); // re-render
        onClose();
      })
      .catch((error) => {
        setOpenErrorAlert(true)
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
      <DialogTitle textAlign="center">Create New User</DialogTitle>
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
              switch (column.accessorKey) {
                case "sensor.name": {
                  return (
                    <FormControl fullWidth>
                      <InputLabel id="allClients">Sensor</InputLabel>
                      <Select
                        key={"sensor_id"}
                        {...register("sensor_id")}
                        error={errors["sensor_id"] ? true : false}
                        labelId="allClients"
                        label="Sensor"
                        name={"sensor_id"}
                        onChange={(e) => {

                          setValues({
                            ...values,
                            sensor_id: e.target.value,
                          });
                        }}
                      >
                        <MenuItem value={"None"}>
                          None
                        </MenuItem>
                        {sensors.map((sensor) => (
                          <MenuItem key={sensor.id} value={sensor.id}>
                            {sensor.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography variant="inherit" color="error">
                        {errors["sensor_id"]?.message}
                      </Typography>
                    </FormControl>
                  )
                }
                case "client.id": {
                  return (<FormControl fullWidth>
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
                  </FormControl>)
                }
                case 'status': {
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
                  )
                }
                case "role": {
                  return (<FormControl fullWidth>
                    <InputLabel id="role-select-label">
                      {column.header}
                    </InputLabel>
                    <Select
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
                      {roles.map((role) => (
                        <MenuItem key={role.type} value={role.type}>
                          {role.role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>)
                }
                default: {
                  return (
                    <>
                      <TextField
                        key={column.accessorKey}
                        label={column.header}
                        name={column.accessorKey}
                        {...register(column.accessorKey)}
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
                  )
                }
              }
            })
          }
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
          Create New User
        </Button>
      </DialogActions>
      <Snackbar
       anchorOrigin={{ vertical: "top", horizontal: "right" }}
       open={openErrorAlert} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
         {notificationMsg.notificationMsg}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;

const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

const validatePassword = (password) => password.length >= 8;

function mapStateToProps(state) {
  return {
    notificationMsg: state.message
  };
}

export default connect(mapStateToProps)(User);
