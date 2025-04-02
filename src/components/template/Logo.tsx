import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline' | 'small'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number | string
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props
    const getLogoSrc = (mode: string, type: string) => {
        if (type === 'small') return '/img/logo/logo-light-small.svg' // Logo en SVG
        return `${LOGO_SRC_PATH}logo-${mode}-${type}.png` // Logo en PNG
    }
    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            <img
                className={imgClass}
                src={getLogoSrc(mode, type)} // Usamos la función para obtener el src
                alt={`${APP_NAME} logo`}
                style={
                    getLogoSrc(mode, type).endsWith('.svg')
                        ? {}
                        : {
                              // Establecemos estilos vacíos si es SVG
                              width: '150px', // Fuerza el ancho
                              height: 'auto', // Mantiene la proporción
                              maxWidth: 'none', // Elimina restricciones
                              maxHeight: 'none', // Elimina restricciones
                          }
                }
            />
        </div>
    )
}

export default Logo
