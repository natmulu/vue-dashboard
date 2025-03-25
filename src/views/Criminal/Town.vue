<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			<div class="space-y-6">
				<ComponentCard title="Manage Towns">
					<div class="space-y-6">
						<div>
							<label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
								Town Name
							</label>
							<input type="text" v-model="name" placeholder="Enter Town Name"
								class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
						</div>
					</div>

					<Button size="sm" variant="primary" @click="handleForm"> 
						<span v-if="!editValue">
							{{ adding ? 'Adding' : 'Add' }} 
						</span>
						<span v-else>
							{{ updating ? 'Updating' : 'Update' }} 
						</span>
					</Button>
					<Alert
						v-if="successMessage"
						variant="success"
						:message="successMessage"
						:showLink="false"
					/>
					<Alert
						v-if="errorMessage"
						variant="warning"
						:message="errorMessage"
						:showLink="false"
					/>
				</ComponentCard>
			</div>

			<div
				class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
				<div class="max-w-full overflow-x-auto custom-scrollbar">


					<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
							<thead
								class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
								<tr>
									<th scope="col" class="px-6 py-3">
										Name
									</th>
									<th scope="col" class="px-6 py-3">
										Action
									</th>

								</tr>
							</thead>
							<tbody>
								<tr v-for="town in towns" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
									<th scope="row"
										class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
										{{ town.name }}
									</th>

									<td class="px-6 py-4">
										<a @click="editTown(town)"	class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
										|
										<a @click="confirmDelete(town)" class="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</a>
									</td>
								</tr>

							</tbody>
						</table>
					</div>

				</div>
			</div>

		</div>
		<div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
			<div class="bg-white rounded-lg shadow-lg w-96 p-6">
			<h2 class="text-xl font-semibold mb-4"> Confirm Delete </h2>
			<p class="text-gray-700 mb-6">Are you sure to delete <span class="text-teal-600">{{ town.name }}</span></p>
			<div class="flex justify-end space-x-2">
				<button @click="() => isModalOpen = false" class="px-4 py-2 bg-gray-300 rounded-lg">No</button>
				<button @click="deleteTown()" class="px-4 py-2 bg-blue-600 bg-opacity-80 text-white rounded-lg">Yes</button>
			</div>
			</div>
		</div>
	</AdminLayout>
</template>

<script>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Alert from '@/components/ui/Alert.vue'
import Button from '@/components/ui/Button.vue'
import axios from 'axios'

export default {
	data() {
		return {
			currentPageTitle: 'Towns',
			towns: [],
			town: {},
			name: '',
			adding: false,
			successMessage: '',
			errorMessage: '',
			editValue: null,
			updating: false,
			isModalOpen: false,
		}
	},
	components: {
		AdminLayout,
		PageBreadcrumb,
		ComponentCard,
		Button,
		Alert,	
	},
	methods: {
		addTown() {
			this.adding = true
			this.successMessage = ''
			this.errorMessage = ''
			axios
				.post(this.$store.state.apiServer + 'town', {
					name: this.name,
				})
				.then(response => {
					this.successMessage = response.data.message
					this.name = ''
					this.adding = false
					setTimeout(() => this.successMessage = '', 4000)
					this.loadTowns()
				})
				.catch(error => {
					this.errorMessage = error.response.data.message
					this.adding = false
					setTimeout(() => this.errorMessage = '', 4000)
				})
		},
		updateTown() {
			this.adding = false
			this.updating = true
			this.successMessage = ''
			this.errorMessage = ''
			axios
				.put(this.$store.state.apiServer + 'town/' + this.editValue, {
					name: this.name,
				})
				.then(response => {
					this.successMessage = response.data.message
					this.name = ''
					this.updating = false
					this.editValue = null
					setTimeout(() => this.successMessage = '', 4000)
					this.loadTowns()
				})
				.catch(error => {
					this.errorMessage = error.response.data.message
					this.updating = false
					setTimeout(() => this.errorMessage = '', 4000)
				})
		},
		handleForm() {
			if(this.editValue) {
				this.updateTown()
			} else {
				this.addTown()
			}
		},
		loadTowns() {
			axios
				.get(this.$store.state.apiServer + 'town')
				.then(response => {
					this.towns = response.data.data
				})
		},
		editTown(town) {
			this.editValue = town.id
			this.name = town.name
		},
		confirmDelete(town) {
			this.town = town
			this.isModalOpen = true
		},
		deleteTown() {
			if(!this.town.hasOwnProperty('id')) return

			axios
				.delete(this.$store.state.apiServer + 'town/' + this.town.id)
				.then(response => {
					this.successMessage = response.data.message
					setTimeout(() => this.successMessage = '', 4000)
					this.loadTowns()
					this.isModalOpen = false
					this.town = {}
				})
				.catch(error => {
					this.errorMessage = error.response.data.message
					setTimeout(() => this.errorMessage = '', 4000)
				})
		}
	},
	mounted() {
		this.loadTowns()
	}
}

</script>