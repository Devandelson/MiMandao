async function extractImages(files: Express.Multer.File[] | undefined, uniqueNumber: string) {
    if (!files || files.length === 0) return [];
    return files.map((item) => `${uniqueNumber}-${item.originalname}`);
}
export default extractImages;