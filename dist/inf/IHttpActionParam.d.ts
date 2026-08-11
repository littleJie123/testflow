export default interface IHttpActionParam {
    name?: string;
    url?: string;
    method?: string;
    headers?: any;
    param?: any;
    highlight?: any;
    /** 步骤备注，展示在 detail 步骤列表与弹窗 */
    remark?: string;
    /** DownloadExcelAction：要解析的 sheet 名；默认第一个 */
    sheetName?: string;
}
