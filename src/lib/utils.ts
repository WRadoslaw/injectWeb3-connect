export const capitalizeFirstLetter = <T extends string>(str: T) =>
	(str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>
export const firstValueFrom = <T>(source: any): Promise<T> =>
	source instanceof Promise
		? source
		: new Promise<T>((resolve, reject) => {
			const subscriber = source.subscribe({
				next: (value: T) => {
					resolve(value)
					subscriber.unsubscribe()
				},
				error: reject,
				complete: () => {
					reject(
						new Error(
							'Failed to extract first value from source',
						),
					)
				},
			})
		})

