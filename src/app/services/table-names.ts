export const tables = [{
    "name": "ODSnapshot",
    "dataSourceType": "SourceTable",
    "airRmDomain": "Inventory",
    "grain": "Flight"
},
{
    "name": "LegSnapshot",
    "dataSourceType": "SourceTable",
    "airRmDomain": "Inventory",
    "grain": "Leg"
},
{
    "name": "ODInventory",
    "dataSourceType": "QueryMap",
    "airRmDomain": "Inventory",
    "grain": "Flight"
},
{
    "name": "LegInventory",
    "dataSourceType": "QueryMap",
    "airRmDomain": "Inventory",
    "grain": "Leg"
},
{
    "name": "LegSchedule",
    "dataSourceType": "SourceTable",
    "airRmDomain": "Inventory",
    "grain": "Leg"
}
]


export const columns = {
    "dataSourceType": "SourceTable",
    "airRmDomain": "Inventory",
    "grain": "Leg",
    "autoGenerateIdentityColumns": false,
    "models": [
        {
            "modelType": "SeatInventory",
            "kpiName": "Authorizations",
            "container": "FareClass", "columnType": "Int32", "columnName": "Au", "isNullable": false
        },
        {
            "modelType": "SeatInventory",
            "kpiName": "Bookings",
            "container": "FareClass",
            "columnType": "Int32",
            "columnName": "Bk",
            "isNullable": false
        },
        {
            "modelType": "SeatInventory",
            "kpiName": "SeatsAvailable",
            "container": "FareClass",
            "columnType": "Int32", "columnName": "Sa",
            "isNullable": true
        }],
    "idScheme": "airRM:LegSchedule.MasterKey",
    "columns": [
        {
            "resourceName": "LegSnapshot:MasterKey",
            "columnType": "Int64", "name": "MasterKey",
            "isNullable": true
        },
        {
            "container": "FareClass",
            "ordinalType": "SnapshotStyle",
            "modelIndex": 0,
            "resourceName": "LegSnapshot:Au/FC1",
            "columnType": "Int32",
            "name": "Au",
            "ordinal": "FC1", "isNullable": false
        },
        {
            "container": "FareClass",
            "ordinalType": "SnapshotStyle",
            "modelIndex": 0,
            "resourceName": "LegSnapshot:Au/FC2",
            "columnType": "Int32", "name": "Au",
            "ordinal": "FC2",
            "isNullable": false
        },
        {
            "container": "FareClass",
            "ordinalType": "SnapshotStyle",
            "modelIndex": 0,
            "resourceName": "LegSnapshot:Au/FC3",
            "columnType": "Int32", "name": "Au",
            "ordinal": "FC3",
            "isNullable": false
        },

        {
            "container": "FareClass",
            "ordinalType": "SnapshotStyle",
            "modelIndex": 0,
            "resourceName": "LegSnapshot:Au/FC4",
            "columnType": "Int32",
            "name": "Au",
            "ordinal": "FC4",
            "isNullable": false
        },
        {
            "container": "FareClass",
            "ordinalType": "SnapshotStyle",
            "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC5",
            "columnType": "Int32", "name": "Au",
            "ordinal": "FC5",
            "isNullable": false
        }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC6", "columnType": "Int32", "name": "Au", "ordinal": "FC6", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC7", "columnType": "Int32", "name": "Au", "ordinal": "FC7", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC8", "columnType": "Int32", "name": "Au", "ordinal": "FC8", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC9", "columnType": "Int32", "name": "Au", "ordinal": "FC9", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC10", "columnType": "Int32", "name": "Au", "ordinal": "FC10", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC11", "columnType": "Int32", "name": "Au", "ordinal": "FC11", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC12", "columnType": "Int32", "name": "Au", "ordinal": "FC12", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC13", "columnType": "Int32", "name": "Au", "ordinal": "FC13", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC14", "columnType": "Int32", "name": "Au", "ordinal": "FC14", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC15", "columnType": "Int32", "name": "Au", "ordinal": "FC15", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC16", "columnType": "Int32", "name": "Au", "ordinal": "FC16", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC17", "columnType": "Int32", "name": "Au", "ordinal": "FC17", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC18", "columnType": "Int32", "name": "Au", "ordinal": "FC18", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC19", "columnType": "Int32", "name": "Au", "ordinal": "FC19", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC20", "columnType": "Int32", "name": "Au", "ordinal": "FC20", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC21", "columnType": "Int32", "name": "Au", "ordinal": "FC21", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC22", "columnType": "Int32", "name": "Au", "ordinal": "FC22", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC23", "columnType": "Int32", "name": "Au", "ordinal": "FC23", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC24", "columnType": "Int32", "name": "Au", "ordinal": "FC24", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 0, "resourceName": "LegSnapshot:Au/FC25", "columnType": "Int32", "name": "Au", "ordinal": "FC25", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC1", "columnType": "Int32", "name": "Bk", "ordinal": "FC1", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC2", "columnType": "Int32", "name": "Bk", "ordinal": "FC2", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC3", "columnType": "Int32", "name": "Bk", "ordinal": "FC3", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC4", "columnType": "Int32", "name": "Bk", "ordinal": "FC4", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC5", "columnType": "Int32", "name": "Bk", "ordinal": "FC5", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC6", "columnType": "Int32", "name": "Bk", "ordinal": "FC6", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC7", "columnType": "Int32", "name": "Bk", "ordinal": "FC7", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC8", "columnType": "Int32", "name": "Bk", "ordinal": "FC8", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC9", "columnType": "Int32", "name": "Bk", "ordinal": "FC9", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC10", "columnType": "Int32", "name": "Bk", "ordinal": "FC10", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC11", "columnType": "Int32", "name": "Bk", "ordinal": "FC11", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC12", "columnType": "Int32", "name": "Bk", "ordinal": "FC12", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC13", "columnType": "Int32", "name": "Bk", "ordinal": "FC13", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC14", "columnType": "Int32", "name": "Bk", "ordinal": "FC14", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC15", "columnType": "Int32", "name": "Bk", "ordinal": "FC15", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC16", "columnType": "Int32", "name": "Bk", "ordinal": "FC16", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC17", "columnType": "Int32", "name": "Bk", "ordinal": "FC17", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC18", "columnType": "Int32", "name": "Bk", "ordinal": "FC18", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC19", "columnType": "Int32", "name": "Bk", "ordinal": "FC19", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC20", "columnType": "Int32", "name": "Bk", "ordinal": "FC20", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC21", "columnType": "Int32", "name": "Bk", "ordinal": "FC21", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC22", "columnType": "Int32", "name": "Bk", "ordinal": "FC22", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC23", "columnType": "Int32", "name": "Bk", "ordinal": "FC23", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC24", "columnType": "Int32", "name": "Bk", "ordinal": "FC24", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 1, "resourceName": "LegSnapshot:Bk/FC25", "columnType": "Int32", "name": "Bk", "ordinal": "FC25", "isNullable": false }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC1", "columnType": "Int32", "name": "Sa", "ordinal": "FC1", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC2", "columnType": "Int32", "name": "Sa", "ordinal": "FC2", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC3", "columnType": "Int32", "name": "Sa", "ordinal": "FC3", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC4", "columnType": "Int32", "name": "Sa", "ordinal": "FC4", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC5", "columnType": "Int32", "name": "Sa", "ordinal": "FC5", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC6", "columnType": "Int32", "name": "Sa", "ordinal": "FC6", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC7", "columnType": "Int32", "name": "Sa", "ordinal": "FC7", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC8", "columnType": "Int32", "name": "Sa", "ordinal": "FC8", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC9", "columnType": "Int32", "name": "Sa", "ordinal": "FC9", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC10", "columnType": "Int32", "name": "Sa", "ordinal": "FC10", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC11", "columnType": "Int32", "name": "Sa", "ordinal": "FC11", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC12", "columnType": "Int32", "name": "Sa", "ordinal": "FC12", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC13", "columnType": "Int32", "name": "Sa", "ordinal": "FC13", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC14", "columnType": "Int32", "name": "Sa", "ordinal": "FC14", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC15", "columnType": "Int32", "name": "Sa", "ordinal": "FC15", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC16", "columnType": "Int32", "name": "Sa", "ordinal": "FC16", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC17", "columnType": "Int32", "name": "Sa", "ordinal": "FC17", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC18", "columnType": "Int32", "name": "Sa", "ordinal": "FC18", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC19", "columnType": "Int32", "name": "Sa", "ordinal": "FC19", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC20", "columnType": "Int32", "name": "Sa", "ordinal": "FC20", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC21", "columnType": "Int32", "name": "Sa", "ordinal": "FC21", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC22", "columnType": "Int32", "name": "Sa", "ordinal": "FC22", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC23", "columnType": "Int32", "name": "Sa", "ordinal": "FC23", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC24", "columnType": "Int32", "name": "Sa", "ordinal": "FC24", "isNullable": true }, { "container": "FareClass", "ordinalType": "SnapshotStyle", "modelIndex": 2, "resourceName": "LegSnapshot:Sa/FC25", "columnType": "Int32", "name": "Sa", "ordinal": "FC25", "isNullable": true }], "tableScheme": "Simple", "name": "LegSnapshot", "identityColumns": ["MasterKey"]
}