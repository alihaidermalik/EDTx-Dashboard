import React from 'react';
import { NavLink } from 'react-router-dom';

import { findBlockInTasktree } from '../helpers';

const BreadCrumbs = ({ tasktree, sectionID, type, courseID }) => {

    const this_block = findBlockInTasktree(tasktree, sectionID);
    const parent_block = this_block ? findBlockInTasktree(tasktree, this_block.parent) : null;
    const parent_parent_block = parent_block ? findBlockInTasktree(tasktree, parent_block.parent) : null;

    if (this_block) {


        switch (type) {
            case 'sections':
                return (
                    <ol className={"breadcrumbs-list"}>
                        <ul className={'breadcrumb'}>
                            <NavLink to={"/courses/" + courseID} className={'breadcrumb-navlink'}>
                                {parent_block ? parent_block.section_name : courseID}
                            </NavLink>
                        </ul>
                        <ul className={'breadcrumb'}>{this_block['section_name']}</ul>
                    </ol>
                )
            case 'subsections':
                return (
                    <ol className={"breadcrumbs-list"}>
                        <ul className={'breadcrumb'}>
                            <NavLink to={"/courses/" + courseID} className={'breadcrumb-navlink'}>
                                {tasktree.section_name ? tasktree.section_name : courseID}
                            </NavLink>
                        </ul>
                        <ul className={'breadcrumb'}>

                            <NavLink to={"/sections/" + courseID + "/" + this_block['parent']}
                                className={'breadcrumb-navlink'}>
                                {parent_block['section_name'] ? parent_block['section_name'] : "Parent"}
                            </NavLink>
                        </ul>
                        <ul className={'breadcrumb'}>{this_block['section_name']}</ul>
                    </ol>
                )
            case 'units':
                return (
                    <ol className={"breadcrumbs-list"}>
                        <ul className={'breadcrumb'}>
                            <NavLink to={"/courses/" + courseID} className={'breadcrumb-navlink'}>
                                {tasktree.section_name ? tasktree.section_name : courseID}
                            </NavLink>
                        </ul>
                        <ul className={'breadcrumb'}>
                            <NavLink to={"/sections/" + courseID + "/" + parent_block['parent']}
                                className={'breadcrumb-navlink'}>
                                {parent_parent_block['section_name'] ? parent_parent_block['section_name'] : "Parent"}
                            </NavLink>
                        </ul>
                        <ul className={'breadcrumb'}>
                            <NavLink to={"/subsections/" + courseID + "/" + this_block['parent']}
                                className={'breadcrumb-navlink'}>
                                {parent_block['section_name'] ? parent_block['section_name'] : "Parent"}
                            </NavLink>
                        </ul>
                        <ul className={'breadcrumb'}>{this_block['section_name']}</ul>
                    </ol>
                )
            default:
                return null;
        }
    } else {
        return null;
    }
};


export default BreadCrumbs;