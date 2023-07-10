const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const converterService = require("./converter.service");
const { FILE_MISSING, QUERY_MISSING } = require("../../shared/error");

router.post("/convert", upload.single("file"), async (req, res, next) => {
  try {
    let result = "";
    let jsonValue;
    let fileFormat = req.file?.mimetype.split("/")[1].toLowerCase();

    const { outputFormat, filterKey, modifyKey } = req.body;
    //1. check if file exist
    if (!req.file) {
      const e = new Error("No file to convert");
      e.name = FILE_MISSING;
      throw e;
    }
    //2. check output format given
    if (!outputFormat) {
      const e = new Error("Wrong request, missing output format");
      e.name = QUERY_MISSING;
      throw e;
    }

    //1. start convert process
    const formatValue = {
      format: fileFormat,
      value: String(req.file.buffer),
    };
    if (fileFormat !== "json") {
      jsonValue = await converterService.convertToJson(formatValue);
    } else if (fileFormat === "json") {
      jsonValue = JSON.parse(String(req.file.buffer));
    }

    //2. additional process
    if (filterKey) {
      jsonValue = converterService.setFilterKey(filterKey, jsonValue);
    }

    if (modifyKey) {
      jsonValue = converterService.setModifyKey(modifyKey, jsonValue);
    }

    //3. convert to desire format
    result = converterService.convertTo(outputFormat, jsonValue);
    res.setHeader("Content-type", "application/octet-stream");
    res.setHeader(
      "Content-disposition",
      `attachment; filename=converted.${outputFormat}`
    );
    res.send(Buffer.from(result, "utf8"));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
