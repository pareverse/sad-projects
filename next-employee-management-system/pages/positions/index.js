import { EditIcon, DeleteIcon } from 'components/icons'
import { useState, useContext } from 'react'
import { Themes } from 'components/themes'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Store } from 'sources/stores'
import Link from 'next/link'
import axios from 'axios'
import useSWR from 'swr'

const Items = styled.div`
	&:nth-child(1) {
		align-items: center;
		display: flex;

		span {
			font-size: 1.5rem;
			font-weight: 600;
		}
	}

	&:nth-child(2) {
		button {
			background-color: ${ Themes.Colors.Primary };
			color: hsl(0, 0%, 100%);
			border-radius: 4px;
			font-size: 1.3rem;
			font-weight: 500;
			padding: 0 30px;
			height: 40px;
		}
	}

	&:nth-child(3) {
		outline: 1px solid hsl(230, 100%, 95%);
		grid-column: 1 / span 2;
		border-radius: 5px;

		table {
			border-collapse: collapse;
			text-align: center;
			width: 100%;

			thead {
				box-shadow: rgba(149, 157, 165, 0.1) 0 0 15px;

				th {
					font-size: 1.3rem;
					font-weight: 600;
					height: 50px;
				}
			}

			tbody {
				tr {
					&:nth-child(even) {
						background-color: hsl(230, 100%, 99%);
					}
				}

				td {
					font-size: 1.15rem;
					height: 50px;

					&:last-child {
						button {
							border-radius: 4px;
							height: 30px;
							width: 30px;

							&:nth-child(1) {
								background-color: ${ Themes.Colors.Primary };
								margin-right: 5px;
							}

							&:nth-child(2) {
								background-color: ${ Themes.Colors.Danger };
							}

							svg {
								fill: hsl(0, 0%, 100%);
								height: 16px;
							}
						}
					}
				}
			}
		}
	}

	&:nth-child(4) {
		grid-column: 1 / span 2;

		span {
			background-color: ${ Themes.Colors.Danger };
			grid-template-columns: 1fr auto auto;
			align-items: center;
			border-radius: 5px;
			padding: 0 15px;
			display: grid;
			height: 50px;
			gap: 15px;

			p {
				color: hsl(0, 0%, 100%);
				font-size: 1.3rem;
				font-weight: 500;
			}

			button {
				background-color: transparent;
				color: hsl(0, 0%, 100%);
				border-radius: 5px;
				font-size: 1.3rem;
				font-weight: 500;
				padding: 0 15px;
				height: 30px;

				&:nth-child(3) {
					border: 2px solid hsl(0, 0%, 100%);
				}
			}
		}
	}
`

const Wrapper = styled.div`
	box-shadow: rgba(149, 157, 165, 0.1) 0 0 15px;
	grid-template-rows: auto 1fr auto;
	grid-template-columns: 1fr auto;
	background-color: white;
	border-radius: 5px;
	max-width: 1166px;
	min-height: 100%;
	padding: 30px;
	display: grid;
	width: 100%;
	gap: 30px;
`

const Container = styled.div`
	justify-content: center;
	min-height: 100%;
	display: flex;
	padding: 30px;
	width: 100%;
`

const Positions = () => {

	const router = useRouter()

	const fetcher = async (url) => await axios.get(url).then((res) => res.data)
	const { data, error } = useSWR('/api/positions', fetcher, { refreshInterval: 1000 })

	const { state, dispatch } = useContext(Store)
	const { position_edit_id, position_delete_id } = state

	const [ useDelete, setUseDelete ] = useState(false)

	const HANDLE_EDIT = ( _id, position, rate ) => {
		router.push('/positions/edit')
		dispatch({ type: 'POSITION_EDIT_DATA', payload: { _id, position, rate } })
	}

	const HANDLE_BUTTON = (_id) => {
		if ( useDelete ) {
			setUseDelete(false)
			dispatch({ type: 'POSITION_DELETE_ID', payload: '' })
		} else {
			setUseDelete(true)
			dispatch({ type: 'POSITION_DELETE_ID', payload: _id })
		}
	}

	const HANDLE_DELETE = async () => {
		await axios.post('/api/positions/delete', {
			_id: position_delete_id
		}).then((response) => {
			setUseDelete(false)
		}).catch((error) => {

		})
	}

	return (
		<Container>
			<Wrapper>
				<Items>
					<span>POSITIONS</span>
				</Items>

				<Items>
					<Link href="/positions/add">
						<button>ADD NEW</button>
					</Link>
				</Items>

				<Items>
					<table>
						<thead>
							<tr>
								<th>POSITION</th>
								<th>RATE PER HOUR</th>
								<th>CONTROLS</th>
							</tr>
						</thead>

						<tbody>
							{
								data && data.map(data => (
									<tr key={ data._id }>
										<td>{ data.position.toUpperCase() }</td>
										<td>₱{ data.rate }</td>

										<td>
											<button onClick={ () => HANDLE_EDIT(data._id, data.position, data.rate ) }>
												<EditIcon />
											</button>

											<button onClick={ () => HANDLE_BUTTON(data._id) }>
												<DeleteIcon />
											</button>
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
				</Items>

				{
					useDelete && 
					<Items>
						<span>
							<p>Are you sure you want to delete?</p>
							<button onClick={ HANDLE_BUTTON }>CANCEL</button>
							<button onClick={ HANDLE_DELETE }>DELETE</button>
						</span>
					</Items>
				}
			</Wrapper>
		</Container>
	)
}

export default Positions