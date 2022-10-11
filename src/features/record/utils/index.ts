import { showNotification } from '../../../utils/mantine';

type RecordNotificationType =
	| 'queryError'
	| 'addSuccess'
	| 'addError'
	| 'editSuccess'
	| 'editError'
	| 'deleteSuccess'
	| 'deleteError';
type RequiredNotificationProps = Pick<Parameters<typeof showNotification>[0], 'title' | 'message' | 'status'>;

export const showRecordNotification = (type: RecordNotificationType) => {
	const notificationProps: Record<RecordNotificationType, RequiredNotificationProps> = {
		queryError: {
			status: 'error',
			title: 'Error',
			message: 'An error occurred while getting patient records.',
		},
		addSuccess: {
			status: 'success',
			title: 'Add Record',
			message: 'Successfully added patient to records.',
		},
		addError: {
			status: 'error',
			title: 'Error',
			message: 'An error occurred while adding patient to records.',
		},
		editSuccess: {
			status: 'success',
			title: 'Add Transaction',
			message: "Successfully added transaction to patient's records.",
		},
		editError: {
			status: 'error',
			title: 'Error',
			message: "An error occurred while adding transaction to patient's records.",
		},
		deleteSuccess: {
			status: 'success',
			title: 'Delete Record',
			message: "Successfully deleted the patient's records.",
		},
		deleteError: {
			status: 'error',
			title: 'Error',
			message: "An error occurred while deleting the patient's records.",
		},
	};

	showNotification(notificationProps[type]);
};
