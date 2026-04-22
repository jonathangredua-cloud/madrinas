DROP VIEW "MADRINAS_WMS"."PMX_MAD_WAVE_GROUPING_INNORMAX";

CREATE VIEW "MADRINAS_WMS"."PMX_MAD_WAVE_GROUPING_INNORMAX" (
    "DocEntry",
    "PickObjType",
    "WaveKey",
    "PmxWhsCode",
    "CardCode",
    "PickListStatus",
    "Grouping",
    "kEY_DocEntry"
) AS
SELECT
    "PMX_PLHE"."DocEntry",
    "PMX_PLHE"."PickObjType",
    1 AS "WaveKey",
    "PMX_OSEL"."PmxWhsCode",
    "PMX_PLHE"."CardCode",
    "PMX_PLHE"."PickListStatus",
    'WAVE' AS "Grouping",
    "PMX_PLHE"."DocEntry" AS "kEY_DocEntry"
FROM "PMX_PLHE"
LEFT JOIN "PMX_OSEL" ON "PMX_PLHE"."DestStorLocCode" = "PMX_OSEL"."Code"
WHERE "PMX_PLHE"."DocStatus" = 'O'
  AND "PMX_PLHE"."PickListStatus" IN ('N')
  AND "PMX_PLHE"."DocEntry" IN (
      SELECT PLI."DocEntry"
      FROM "PMX_PLLI" PLI
      INNER JOIN "PMX_PLPL" PLPL ON PLPL."DocEntry" = PLI."BaseEntry"
          AND PLI."BaseType" = 'PMX_PLPH'
      INNER JOIN "ORDR" O ON O."DocEntry" = PLPL."BaseEntry"
          AND PLPL."BaseType" = 17
      WHERE O."U_WaveGroup" = 'Y'
  )
WITH READ ONLY;
