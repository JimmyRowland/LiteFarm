import styles from "./styles.scss";
import Form from "../Form";
import Button from "../Form/Button";
import signup7 from "../../assets/images/signUp/signup7.svg";
import clsx from "clsx";
import { FaLeaf } from "react-icons/fa";
import Checkbox from "../Form/Checkbox";
import Input from "../Form/Input";
import PropTypes from "prop-types";
import React from "react";

export function PureOrganicPartners({ inputs = [{}, {}], onSubmit, onGoBack, disabled }) {
  return <Form onSubmit={onSubmit} buttonGroup={
    <><Button onClick={onGoBack} color={'secondary'} fullLength>Go Back</Button><Button type={'submit'}
                                                                                        fullLength disabled={disabled}>Continue</Button></>
  }>
    <img src={signup7} alt={'Avatar'} className={styles.svg} loading={'lazy'}/>
    <div className={styles.svgtitle}>Great!</div>
    <p className={clsx(styles.paragraph)}>We'll indicate data required for organic certification with <span
      className={styles.leaf}><FaLeaf/></span> throughout the app!</p>
    <label className={styles.checkboxLabel}>Please select your certifier</label>
    <Checkbox classes={{container: styles.firstCheckboxContainer}} {...inputs[0]}/>
    <Checkbox  classes={{container: styles.secondCheckboxContainer}} {...inputs[1]}/>
    <Input {...inputs[2]}/>
  </Form>
}

PureOrganicPartners.prototype = {
  onSubmit: PropTypes.func,
  inputs: PropTypes.arrayOf(PropTypes.exact({ label: PropTypes.string, info: PropTypes.string, icon: PropTypes.node })),
}
