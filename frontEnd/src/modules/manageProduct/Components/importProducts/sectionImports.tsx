// ManageProduct.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faImages } from "@fortawesome/free-solid-svg-icons";

const fileStyle =
    "w-full text-xs text-gray-500 file:mr-3 file:border-0 file:rounded-md file:bg-gray-900 file:text-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:cursor-pointer";

export default function SectionImports() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-900">Importación de productos</h3>

            <div className="flex flex-col gap-2 border border-dashed border-gray-300 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800">
                    <FontAwesomeIcon icon={faFileExcel} className="mr-2 text-green-600" />
                    Subir archivo de excel
                </p>
                <input type="file" accept=".xlsx,.xls" className={fileStyle} />
            </div>

            <div className="flex flex-col gap-2 border border-dashed border-gray-300 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800">
                    <FontAwesomeIcon icon={faImages} className="mr-2 text-[#e60023]" />
                    Conjunto de imagenes de productos
                </p>
                <input type="file" accept="image/*" multiple className={fileStyle} />
            </div>
        </div>
    )
}