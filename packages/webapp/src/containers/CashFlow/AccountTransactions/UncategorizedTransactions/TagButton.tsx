// @ts-nocheck
import { Button } from "@blueprintjs/core"
import styles from './TagButton.module.scss';



export const TagButton = (props) => {
  return <Button  {...props} className={styles.root} />
}