export interface MdPaths {
    srcPath: string;
    distPath: string;
}
export default class MdPathUtil {
    static resolveSrcAndDist(filePath: string): MdPaths;
    static sameMdFile(filePathA: string, filePathB: string): boolean;
    static validateMdPath(filePath: string): void;
    static readContent(filePath: string): string;
    static writeContent(filePath: string, content: string): MdPaths;
    static toListJson(filePath: string): {
        type: string;
        actionType: string;
        name: string;
        id: string;
        filePath: string;
        srcPath: string;
        distPath: string;
        couldLookDetail: boolean;
    };
}
