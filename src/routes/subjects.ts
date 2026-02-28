import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";
import { departments, subjects } from "../db/schema";
import { db } from "../db";
import { get } from "node:http";

const router = express.Router();

//Get all subjects with optional search, filtering and pagination
router.get('/', async (req, res) => {
    try{
        const { search, departmentId, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(1, parseInt(String(page),10) || 1)
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit),10) || 10), 100);

        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions = [];

        //if search query is provided, add a condition to filter subjects by name or code
        if(search){
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )
            )
        }
        //if departmentId is provided, add a condition to filter subjects by department
        if(departmentId){
            filterConditions.push(ilike(departments.name, `%${departmentId}%`));
        }

        //combine all filter conditions using AND operator
        const whereClause = filterConditions.length > 0 ?  and(...filterConditions) : undefined;

        const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(subjects)
        .leftJoin(departments, eq(subjects.departmentId, departments.id))
        .where(whereClause);

        const totalCount = countResult[0]?.count ?? 0;

        const subjectList = await db
        .select({ ...getTableColumns(subjects),
         departmentName: {...getTableColumns(departments)}
        }).from(subjects).leftJoin(departments, eq(subjects.departmentId, departments.id))
        .where(whereClause)
        .orderBy(desc(subjects.createdAt))
        .limit(limitPerPage)
        .offset(offset);

        res.status(200).json({
            data: subjectList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalpages: Math.ceil(totalCount / limitPerPage)
            }
        })


    }catch(e){
        console.error('GET /Subjects error:', e);
        res.status(500).json({ error: 'An error occurred while fetching subjects' });
    }
});

export default router;