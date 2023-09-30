import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import MaterialReactTable from "material-react-table";
import { formatDateTimeLocal, formatDateTime } from "../helpers/helper.js";
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
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { connect } from "react-redux";
import { setMessage } from "../actions/message";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useMediaQuery from '@mui/material/useMediaQuery';

const Sensor = (props) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rerender, setReRendering] = useState(false);
  const [clients, setClients] = useState([]);
  const txtClientName = useRef();
  const [locations, setLocations] = useState([]);
  //const txtLocationStatus = useRef();
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
    const fetchLocations = async () => {
      try {
        const response = await VibrationDataService.getactivelocations();
        const json = response.data;
        setLocations(json);
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
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!tableData.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const response = await VibrationDataService.getsensors();
        const json = response.data;
        json.map((item) => {
          if (item.location === null) {
            item.location = {};
            item.location.id = null;
            item.location.name = null;
            item.location.client = {};
            item.location.client.name = "";
          }
          if (item.linked_date === null || item.linked_date === "") {
            item.linked_date = 0; //undefined or null date makes the label and placeholder in the date box to overlap
          }
          if (
            item.last_calibration_date === null ||
            item.last_calibration_date === ""
          ) {
            item.last_calibration_date = 0;
          }
        });
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
        model: values["model"],
        serial_no: values["serial_no"],
        vm: values["vm"],
        email: values["email"],
        vibration_max_limit:
          values["vibration_max_limit"] === ""
            ? null
            : values["vibration_max_limit"],
        last_calibration_date:
          values["last_calibration_date"] === "" ||
          values["last_calibration_date"] === 0
            ? null
            : values["last_calibration_date"],
        remark: values["remark"],
        linked_date:
          values["linked_date"] === "" || values["linked_date"] === 0
            ? null
            : values["linked_date"],
        location_lat:
          values["location_lat"] === "" ? null : values["location_lat"],
        location_lng:
          values["location_lng"] === "" ? null : values["location_lng"],
        sensor_id: values["sensor_id"],
        location_id: values["location.id"],
        state: values["state"] === "true" ? "G" : "F",
      };
      if (row.original.state == "G" && values["state"] === "false") {
        //Going to delete
        if (values["location.id"] !== null) {
          window.alert(
            "Cannot delete sensor. Please unlink location before deleting."
          );
          return;
        }
        if (
          !window.confirm(
            `Are you sure you want to delete ${row.getValue("sensor_id")}`
          )
        ) {
          return;
        }
      }
      if (row.original.location.id !== values["location.id"]) {
        if (values["location.id"] === null) {
          if (
            !window.confirm(
              `Are you sure you want to unlink ${row.original.location.name} from ${values["sensor_id"]}`
            )
          ) {
            return;
          }
          data["linked_date"] = null;
        } else if (row.original.location.id === null) {
          let selectedLocation = locations.find(
            (locatn) => locatn.id === values["location.id"]
          );
          if (
            !window.confirm(
              `Are you sure you want to link ${selectedLocation.name} to ${values["name"]}`
            )
          ) {
            return;
          }
          if (values["state"] === "false") {
            window.alert(
              "Sensor state should be good to link a location to a sensor"
            );
            return;
          }
          data["linked_date"] = formatDateTime(new Date());
        } else {
          let selectedLocation = locations.find(
            (locatn) => locatn.id === values["location.id"]
          );
          let selectedLocationOld = locations.find(
            (locatn) => locatn.id === row.original.location.id
          );
          if (
            !window.confirm(
              `Are you sure you want to change the link from ${selectedLocationOld.name} to ${selectedLocation.name}`
            )
          ) {
            return;
          }
          data["linked_date"] = formatDateTime(new Date());
        }
      }
      VibrationDataService.updatesensor(values.id, data)
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

  const handleUnlinkRow = useCallback(
    (row) => {
      if (row.original.location_id === null) {
        window.alert("Sensor is not linked to any location");
        return;
      }
      if (
        !window.confirm(
          `Are you sure you want to unlink ${row.getValue("sensor_id")}`
        )
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      //tableData.splice(row.index, 1);
      //setTableData([...tableData]);
      const data = {
        serial_no: row.original.serial_no, //This is must for every update
        location_id: null,
        linked_date: null,
      };
      VibrationDataService.updatesensor(row.original.id, data)
        .then((response) => {
          setReRendering((value) => !value);
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
    },
    [tableData]
  );

  const handleDeleteRow = useCallback(
    (row) => {
      if (row.original.location_id !== null) {
        window.alert(
          "Cannot delete sensor. Please unlink location before deleting."
        );
        return;
      }
      if (
        !window.confirm(
          `Are you sure you want to delete ${row.getValue("sensor_id")}`
        )
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      //tableData.splice(row.index, 1);
      //setTableData([...tableData]);
      VibrationDataService.deletesensor(row.getValue("id"))
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
              : cell.column.id === "name" ||
                cell.column.id === "model" ||
                cell.column.id === "serial_no" ||
                cell.column.id === "state"
              ? validateRequired(event.target.value)
              : true;
          if (!isValid) {
            const errorMsg =
              cell.column.id === "email"
                ? `${cell.column.columnDef.header} should be a valid email id`
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
        header: "Sensor Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "sensor_id",
        header: "Sensor Id",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "serial_no",
        header: "Serial No",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "state",
        header: "Sensor State",
        size: 80,
        enableColumnOrdering: false,
        //enableEditing: false, //disable editing on this column
        enableSorting: false,
        accessorFn: (row) => (row.state === "G" ? "true" : "false"), //must be strings
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
            <MenuItem key={"G"} value={"true"}>
              {"Good"}
            </MenuItem>,
            <MenuItem key={"F"} value={"false"}>
              {"Faulty"}
            </MenuItem>,
          ],
        }),
      },
      {
        accessorKey: "location.client.name",
        header: "Client Name",
        size: 140,
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          value: txtClientName.current,
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "location.id",
        Cell: ({ cell }) => <>{cell.row.original.location.name}</>,
        header: "Location Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: (cell, row) => {
          return {
            select: true,
            children: [
              <MenuItem key={0} value={null}>
                {""}
              </MenuItem>,
              locations.map((locatn) => (
                <MenuItem key={locatn.id} value={locatn.id}>
                  {locatn.name}
                </MenuItem>
              )),
            ],
            onChange: (e) => {
              let selectedLocation = locations.find(
                (locatn) => locatn.id === e.target.value
              );
              if (selectedLocation) {
                let selectedClient = clients.find(
                  (client) => client.id === selectedLocation.client_id
                );
                txtClientName.current = selectedClient.name;
              } else {
                txtClientName.current = "";
              }
            },
          };
        },
      },
      {
        accessorKey: "model",
        header: "Model",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
      },
      {
        accessorKey: "vm",
        header: "VM",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "email",
        header: "Email",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "email",
        }),
      },
      {
        accessorKey: "vibration_max_limit",
        header: "Limit",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "last_calibration_date",
        Cell: ({ cell }) => (
          <>
            {cell.row.original.last_calibration_date === 0
              ? ""
              : formatDateTimeLocal(
                  new Date(cell.row.original.last_calibration_date)
                )}
          </>
        ),
        header: "Calibration Date",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "datetime-local",
        }),
      },
      {
        accessorKey: "remark",
        header: "Remark",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "linked_date",
        Cell: ({ cell }) => (
          <>
            {cell.row.original.linked_date === 0
              ? ""
              : formatDateTimeLocal(new Date(cell.row.original.linked_date))}
          </>
        ),
        header: "Linked Date",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "datetime-local",
        }),
      },
      {
        accessorKey: "location_lat",
        header: "Lat",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "location_lng",
        header: "Lng",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
    ],
    [getCommonEditTextFieldProps, clients, locations]
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
    csvExporter._options.filename = "Sensors";
    csvExporter._options.title = "Sensors";
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter._options.filename = "Sensors";
    csvExporter._options.title = "Sensors";
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
            Create New Sensor
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
                  txtClientName.current = row.original.location.client.name;
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
            <Tooltip arrow placement="right" title="Unlink">
              <IconButton color="error" onClick={() => handleUnlinkRow(row)}>
                <LinkOffIcon />
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
              Create New Sensor
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
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        locations={locations}
        clients={clients}
        noOfSensors={tableData.length}
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
  locations,
  clients,
  noOfSensors,
  dispatch,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const setInitialValues = () =>
    columns.reduce((acc, column) => {
      switch (column.accessorKey) {
        case "name":
          acc[column.accessorKey] = "Cambrian Sensor - ";
          break;
        case "state":
          acc[column.accessorKey] = "G";
          break;
        case "model":
          acc[column.accessorKey] = "VSEW_mk2 (8g)";
          break;
        case "linked_date":
        case "last_calibration_date":
          acc[column.accessorKey] = 0;
          break;
        case "location.id":
          acc[column.accessorKey] = 0;
        default:
          acc[column.accessorKey ?? ""] = "";
      }
      return acc;
    }, {});

  useEffect(() => {
    setValues({
      ...values,
      ["name"]: "Cambrian Sensor - " + (noOfSensors + 1),
    });
  }, [noOfSensors]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Sensor name is required"),
    serial_no: Yup.string().required("Serial No is required"),
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
      model: values["model"],
      serial_no: values["serial_no"],
      vm: values["vm"],
      email: values["email"],
      vibration_max_limit:
        values["vibration_max_limit"] === ""
          ? null
          : values["vibration_max_limit"],
      last_calibration_date:
        values["last_calibration_date"] === "" ||
        values["last_calibration_date"] === 0
          ? null
          : values["last_calibration_date"],
      remark: values["remark"],
      linked_date:
        values["linked_date"] === "" || values["linked_date"] === 0
          ? null
          : values["linked_date"],
      location_lat:
        values["location_lat"] === "" ? null : values["location_lat"],
      location_lng:
        values["location_lng"] === "" ? null : values["location_lng"],
      sensor_id: values["sensor_id"],
      location_id: values["location.id"] === "" ? null : values["location.id"],
      state: values["state"],
    };
    if (
      values["location.id"] !== "" &&
      (values["linked_date"] === "" || values["linked_date"] === 0)
    ) {
      let linked_date = formatDateTime(new Date());
      data["linked_date"] = linked_date;
    }
    VibrationDataService.createsensor(data)
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
          if (error.response.data.message == "Validation error") {
            window.alert("Check if sensor name already existts");
          } else if (
            error.response.data.message.startsWith("Cannot add or update")
          ) {
            window.alert("Choose a location");
          }
        }
      });
    //onSubmit(values);
    //onClose();
  };

  return (
    <Dialog open={open} fullScreen={fullScreen}>
      <DialogTitle textAlign="center">Create New Sensor</DialogTitle>
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
              if (column.header === "Location Name") {
                /*return (
                  <LocationsList setValues={setValues} values={values} column={column}/>
                )*/
                return (
                  <FormControl fullWidth>
                    <InputLabel id="allLocations">{column.header}</InputLabel>
                    <Select
                      key={column.accessorKey}
                      labelId="allLocations"
                      label={column.header}
                      name={column.accessorKey}
                      onChange={(e) => {
                        let selectedLocation = locations.find(
                          (location) => location.id === e.target.value
                        );
                        let selectedClient = clients.find(
                          (client) => client.id === selectedLocation.client_id
                        );
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                          ["location.client.name"]: selectedClient.name,
                        });
                      }}
                    >
                      {[
                        <MenuItem key={0} value={null}>
                          {""}
                        </MenuItem>,
                        locations.map((location) => (
                          <MenuItem key={location.id} value={location.id}>
                            {location.name}
                          </MenuItem>
                        )),
                      ]}
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
                      type={
                        column.header === "Calibration Date" ||
                        column.header === "Linked Date"
                          ? "datetime-local"
                          : ""
                      }
                      disabled={
                        column.accessorKey === "id" ||
                        column.accessorKey === "model" ||
                        column.accessorKey === "location.client.name" ||
                        column.accessorKey === "state"
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
          Create New Sensor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) => {
  if (!email.length) return true;
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Sensor);
