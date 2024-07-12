import PlusIcon from "vue-material-design-icons/Plus.vue";
import DotsVerticalIcon from "vue-material-design-icons/DotsVertical.vue";
import SendIcon from "vue-material-design-icons/Send.vue";
import CheckIcon from "vue-material-design-icons/Check.vue";
import DeleteIcon from "vue-material-design-icons/Delete.vue";
import PencilIcon from "vue-material-design-icons/Pencil.vue";
import FileUploadOutlineIcon from "vue-material-design-icons/FileUploadOutline.vue";
import MenuDownIcon from "vue-material-design-icons/MenuDown.vue";
import FolderIcon from "vue-material-design-icons/Folder.vue";
import FilePdfBoxIcon from "vue-material-design-icons/FilePdfBox.vue";
import InformationIcon from "vue-material-design-icons/Information.vue";
import LibraryBooks from '@/assets/custom-icons/LibraryBooks.vue'



const icons: { [key: string]: typeof PlusIcon } = {
  Plus: PlusIcon,
  DotMenu: DotsVerticalIcon,
  Send: SendIcon,
  Check: CheckIcon,
  Delete: DeleteIcon,
  Pencil: PencilIcon,
  FileUploadOutline: FileUploadOutlineIcon,
  MenuDown: MenuDownIcon,
  Folder: FolderIcon,
  PdfBox: FilePdfBoxIcon,
  Information: InformationIcon,
  LibraryBooks: LibraryBooks,
};

export type IconName = keyof typeof icons;
export default icons;
