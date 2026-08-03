/**
 * TestCase / BaseTest 构造可选参数
 */
export default interface IBaseTestOpt {
    /** 用例或步骤备注，展示在 detail 步骤列表与弹窗 */
    remark?: string;
    highlight?: boolean;
}
